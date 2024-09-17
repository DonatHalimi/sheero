import React, { useContext, useEffect, useState } from 'react';
import { DashboardHeader } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import ImagePreviewModal from '../../components/Modal/ImagePreviewModal';
import AddSlideshowModal from '../../components/Modal/Slideshow/AddSlideshowModal';
import EditSlideshowModal from '../../components/Modal/Slideshow/EditSlideshowModal';
import { AuthContext } from '../../context/AuthContext';

const SlideshowPage = () => {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [addImageOpen, setAddImageOpen] = useState(false);
    const [editImageOpen, setEditImageOpen] = useState(false);
    const [deleteImageOpen, setDeleteImageOpen] = useState(false);
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 5;

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        fetchImages();
    }, [addImageOpen, editImageOpen, deleteImageOpen, axiosInstance]);

    const fetchImages = async () => {
        try {
            const response = await axiosInstance.get('/slideshow/get');
            setImages(response.data);
        } catch (error) {
            console.error('Error fetching images', error);
        }
    };

    const handleSelectImage = (imageId) => {
        const id = Array.isArray(imageId) ? imageId[0] : imageId;

        setSelectedImages((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((selectedId) => selectedId !== id)
                : [...prevSelected, id]
        );
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedImages(images.map(image => image._id));
        } else {
            setSelectedImages([]);
        }
    };

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setImagePreviewOpen(true);
    };

    const handleEdit = (image) => {
        setSelectedImage(image);
        setEditImageOpen(true);
    };

    const columns = [
        { key: 'title', label: 'Title' },
        {
            key: 'image',
            label: 'Image',
            render: (item) => (
                <img
                    className='rounded-md cursor-pointer'
                    src={`http://localhost:5000/${item.image}`}
                    alt=""
                    width={70}
                    style={{ position: 'relative', top: '8px' }}
                    onClick={() => handleImageClick(`http://localhost:5000/${item.image}`)}
                />
            )
        },
        { key: 'description', label: 'Description' },
        { key: 'actions', label: 'Actions' }
    ];

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                <DashboardHeader
                    title="Slideshow Images"
                    selectedItems={selectedImages}
                    setAddItemOpen={setAddImageOpen}
                    setDeleteItemOpen={setDeleteImageOpen}
                    itemName="Image"
                />

                <DashboardTable
                    columns={columns}
                    data={images}
                    selectedItems={selectedImages}
                    onSelectItem={handleSelectImage}
                    onSelectAll={handleSelectAll}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={(event) => setCurrentPage(event.selected)}
                    onEdit={handleEdit}
                    containerClassName='max-w-screen-2xl mx-auto'
                />

                <AddSlideshowModal open={addImageOpen} onClose={() => setAddImageOpen(false)} onAddSuccess={fetchImages} />
                <EditSlideshowModal open={editImageOpen} onClose={() => setEditImageOpen(false)} image={selectedImage} onEditSuccess={fetchImages} />
                <DeleteModal
                    open={deleteImageOpen}
                    onClose={() => setDeleteImageOpen(false)}
                    items={selectedImages.map(id => images.find(image => image._id === id)).filter(image => image)}
                    onDeleteSuccess={fetchImages}
                    endpoint="/slideshow/delete-bulk"
                    title="Delete Images"
                    message="Are you sure you want to delete the selected images?"
                />
                <ImagePreviewModal open={imagePreviewOpen} onClose={() => setImagePreviewOpen(false)} imageUrl={selectedImage} />
            </div>
        </div>
    );
};

export default SlideshowPage;