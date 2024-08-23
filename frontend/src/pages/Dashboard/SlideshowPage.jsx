import { Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { ActionButton, BrownCreateOutlinedIcon, OutlinedBrownButton } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import AddSlideshowModal from '../../components/Modal/Slideshow/AddSlideshowModal';
import DeleteSlideshowModal from '../../components/Modal/Slideshow/DeleteSlideshowModal';
import EditSlideshowModal from '../../components/Modal/Slideshow/EditSlideshowModal';
import { AuthContext } from '../../context/AuthContext';

const SlideshowPage = () => {
    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [addImageOpen, setAddImageOpen] = useState(false);
    const [editImageOpen, setEditImageOpen] = useState(false);
    const [deleteImageOpen, setDeleteImageOpen] = useState(false);
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

    const columns = [
        { key: 'title', label: 'Title' },
        { key: 'image', label: 'Image', render: (item) => <img className='rounded-md' src={`http://localhost:5000/${item.image}`} alt="" width={80} /> },
        { key: 'description', label: 'Description' },
        { key: 'actions', label: 'Actions' }
    ];

    const renderActionButtons = (image) => (
        <ActionButton onClick={() => { setSelectedImage(image); setEditImageOpen(true); }}>
            <BrownCreateOutlinedIcon />
        </ActionButton>
    );

    const renderTableActions = () => (
        <div className='flex items-center justify-between w-full mb-4'>
            <Typography variant='h5'>Slideshow Images</Typography>
            <div>
                <OutlinedBrownButton onClick={() => setAddImageOpen(true)} className='!mr-4'>
                    Add Image
                </OutlinedBrownButton>
                {selectedImages.length > 0 && (
                    <OutlinedBrownButton
                        onClick={() => setDeleteImageOpen(true)}
                        disabled={selectedImages.length === 0}
                    >
                        {selectedImages.length > 1 ? 'Delete Selected Images' : 'Delete Image'}
                    </OutlinedBrownButton>
                )}
            </div>
        </div>
    );

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                <DashboardTable
                    columns={columns}
                    data={images}
                    selectedItems={selectedImages}
                    onSelectItem={handleSelectImage}
                    onSelectAll={handleSelectAll}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={(event) => setCurrentPage(event.selected)}
                    renderActionButtons={renderActionButtons}
                    renderTableActions={renderTableActions}
                    containerClassName='max-w-screen-2xl mx-auto'
                />

                <AddSlideshowModal open={addImageOpen} onClose={() => setAddImageOpen(false)} onAddSuccess={fetchImages} />
                <EditSlideshowModal open={editImageOpen} onClose={() => setEditImageOpen(false)} image={selectedImage} onEditSuccess={fetchImages} />
                <DeleteSlideshowModal open={deleteImageOpen} onClose={() => setDeleteImageOpen(false)} images={selectedImages.map(id => images.find(image => image._id === id))} onDeleteSuccess={fetchImages} />
            </div>
        </div>
    );
};

export default SlideshowPage;