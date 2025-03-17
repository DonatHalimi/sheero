import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DashboardHeader, DashboardImage, exportOptions, LoadingDataGrid } from '../../assets/CustomComponents';
import { exportToExcel, exportToJSON } from '../../assets/DataExport';
import DashboardTable from '../../components/Dashboard/DashboardTable';
import DeleteModal from '../../components/Modal/DeleteModal';
import ImagePreviewModal from '../../components/Modal/ImagePreviewModal';
import AddSlideshowModal from '../../components/Modal/Slideshow/AddSlideshowModal';
import EditSlideshowModal from '../../components/Modal/Slideshow/EditSlideshowModal';
import SlideshowDetailsDrawer from '../../components/Modal/Slideshow/SlideshowDetailsDrawer';
import { getImages } from '../../store/actions/slideshowActions';

const SlideshowPage = () => {
    const { images, loading } = useSelector((state) => state.slideshow);
    const dispatch = useDispatch();

    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedImages, setSelectedImages] = useState([]);
    const [addImageOpen, setAddImageOpen] = useState(false);
    const [editImageOpen, setEditImageOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deletionContext, setDeletionContext] = useState(null);
    const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [viewDetailsOpen, setViewDetailsOpen] = useState(false);

    const itemsPerPage = 5;

    useEffect(() => {
        dispatch(getImages());
    }, [dispatch]);

    useEffect(() => {
        const handleKeydown = (e) => {
            if (e.altKey && e.key === 'a') {
                setAddImageOpen(prev => !prev);
            }
        };

        window.addEventListener('keydown', handleKeydown);
        return () => {
            window.removeEventListener('keydown', handleKeydown);
        };
    }, [images]);

    const handleSelectImage = (newSelection) => {
        setSelectedImages(newSelection);
    };

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setImagePreviewOpen(true);
    };

    const handleEdit = (image) => {
        setSelectedImage(image);
        setEditImageOpen(true);
    };

    const handleEditFromDrawer = (image) => {
        setViewDetailsOpen(false);
        setSelectedImage(image);
        setEditImageOpen(true);
    };

    const handleDeleteSuccess = () => {
        dispatch(getImages());
        setSelectedImages([]);
    };

    const handleViewDetails = (image) => {
        setSelectedImage(image);
        setViewDetailsOpen(true);
    };

    const closeDrawer = () => {
        setViewDetailsOpen(false);
        setSelectedImage(null);
    };

    const handleBulkDelete = () => {
        if (selectedImages.length > 0) {
            setDeletionContext({
                endpoint: '/slideshow/delete-bulk',
                data: { ids: selectedImages },
            });
            setDeleteModalOpen(true);
        }
    };

    const handleSingleDelete = (image) => {
        setDeletionContext({
            endpoint: `/slideshow/delete/${image._id}`,
            data: null,
        });
        setDeleteModalOpen(true);
    };

    const columns = [
        { key: 'title', label: 'Title' },
        {
            key: 'image',
            label: 'Image',
            render: (item) => <DashboardImage item={item} handleImageClick={handleImageClick} />
        },
        { key: 'description', label: 'Description' },
        { key: 'actions', label: 'Actions' }
    ];

    const handleExport = (data, format) => {
        format === 'excel' ? exportToExcel(data, 'images_data') : exportToJSON(data, 'images_data');
    };

    return (
        <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
            <div className='flex flex-col items-center justify-center'>
                {loading ? (
                    <LoadingDataGrid />
                ) : (
                    <>
                        <DashboardHeader
                            title="Slideshow Images"
                            selectedItems={selectedImages}
                            setAddItemOpen={setAddImageOpen}
                            setDeleteItemOpen={handleBulkDelete}
                            itemName="Image"
                            exportOptions={exportOptions(images, handleExport)}
                        />

                        <DashboardTable
                            columns={columns}
                            data={images}
                            selectedItems={selectedImages}
                            onSelectItem={handleSelectImage}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={(event) => setCurrentPage(event.selected)}
                            onEdit={handleEdit}
                            onViewDetails={handleViewDetails}
                            onDelete={handleSingleDelete}
                        />
                    </>
                )}

                <AddSlideshowModal open={addImageOpen} onClose={() => setAddImageOpen(false)} onAddSuccess={() => dispatch(getImages())} />
                <EditSlideshowModal open={editImageOpen} onClose={() => setEditImageOpen(false)} image={selectedImage} onViewDetails={handleViewDetails} onEditSuccess={() => dispatch(getImages())} />
                <SlideshowDetailsDrawer open={viewDetailsOpen} onClose={closeDrawer} image={selectedImage} onEdit={handleEditFromDrawer} />

                <DeleteModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    deletionContext={deletionContext}
                    onDeleteSuccess={handleDeleteSuccess}
                    title={deletionContext?.endpoint.includes('bulk') ? 'Delete Images' : 'Delete Image'}
                    message={deletionContext?.endpoint.includes('bulk')
                        ? 'Are you sure you want to delete the selected images?'
                        : 'Are you sure you want to delete this image?'
                    }
                />

                <ImagePreviewModal open={imagePreviewOpen} onClose={() => setImagePreviewOpen(false)} imageUrl={selectedImage} />
            </div>
        </div>
    );
};

export default SlideshowPage;