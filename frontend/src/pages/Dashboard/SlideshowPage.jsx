import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import useAxios from '../../axiosInstance';
import { ActionButton, BoldTableCell, BrownCreateOutlinedIcon, OutlinedBrownButton } from '../../components/Dashboard/CustomComponents';
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
    const itemsPerPage = 6;

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
        setSelectedImages((prevSelected) => {
            if (prevSelected.includes(imageId)) {
                return prevSelected.filter(id => id !== imageId);
            } else {
                return [...prevSelected, imageId];
            }
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedImages(images.map(image => image._id));
        } else {
            setSelectedImages([]);
        }
    };

    const pageCount = Math.ceil(images.length / itemsPerPage);
    const isPreviousDisabled = currentPage === 0;
    const isNextDisabled = currentPage >= pageCount - 1;
    const paginationEnabled = pageCount && pageCount > 1;

    const getCurrentPageItems = () => {
        const startIndex = currentPage * itemsPerPage;
        return images.slice(startIndex, startIndex + itemsPerPage);
    };

    const handlePageClick = (event) => {
        setCurrentPage(event.selected);
    };

    return (
        <>
            <div className='container mx-auto max-w-screen-2xl px-4 mt-20'>
                <div className='flex flex-col items-center justify-center'>
                    <div className='flex items-center justify-between w-full mb-4'>
                        <Typography variant='h5'>Slideshow Images</Typography>
                        <div>
                            <OutlinedBrownButton onClick={() => setAddImageOpen(true)} className='!mr-4'>Add Image</OutlinedBrownButton>
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
                    <TableContainer component={Paper} className='max-w-screen-2xl mx-auto'>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <BoldTableCell>
                                        <Checkbox
                                            checked={selectedImages.length === images.length}
                                            onChange={handleSelectAll}
                                            indeterminate={selectedImages.length > 0 && selectedImages.length < images.length}
                                        />
                                    </BoldTableCell>
                                    <BoldTableCell>Title</BoldTableCell>
                                    <BoldTableCell>Image</BoldTableCell>
                                    <BoldTableCell>Description</BoldTableCell>
                                    <BoldTableCell>Actions</BoldTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {getCurrentPageItems().length > 0 ? (
                                    getCurrentPageItems().map((image) => (
                                        <TableRow key={image._id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedImages.includes(image._id)}
                                                    onChange={() => handleSelectImage(image._id)}
                                                />
                                            </TableCell>
                                            <TableCell>{image.title}</TableCell>
                                            <TableCell>
                                                <img className='rounded-md' src={`http://localhost:5000/${image.image}`} alt="" width={80} />
                                            </TableCell>
                                            <TableCell>{image.description}</TableCell>
                                            <TableCell>
                                                <ActionButton onClick={() => { setSelectedImage(image); setEditImageOpen(true); }}><BrownCreateOutlinedIcon /></ActionButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            No images found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <AddSlideshowModal open={addImageOpen} onClose={() => setAddImageOpen(false)} onAddSuccess={fetchImages} />
                    <EditSlideshowModal open={editImageOpen} onClose={() => setEditImageOpen(false)} image={selectedImage} onEditSuccess={fetchImages} />
                    <DeleteSlideshowModal open={deleteImageOpen} onClose={() => setDeleteImageOpen(false)} images={selectedImages.map(id => images.find(image => image._id === id))} onDeleteSuccess={fetchImages} />

                    {images.length > 0 && paginationEnabled && (
                        <div className="w-full flex justify-start mt-6 mb-24">
                            <ReactPaginate
                                pageCount={pageCount}
                                pageRangeDisplayed={2}
                                marginPagesDisplayed={1}
                                onPageChange={handlePageClick}
                                containerClassName="inline-flex -space-x-px text-sm"
                                activeClassName="text-stone-600 bg-stone-500"
                                previousLinkClassName={`flex items-center justify-center px-1 h-10 text-gray-500 bg-white border border-e-0 border-gray-300 rounded-sm hover:bg-gray-100 hover:text-gray-700 ${isPreviousDisabled ? 'pointer-events-none text-gray-300' : ''}`}
                                nextLinkClassName={`flex items-center justify-center px-1 h-10 text-gray-500 bg-white border border-gray-300 rounded-sm hover:bg-gray-100 hover:text-gray-700 ${isNextDisabled ? 'pointer-events-none text-gray-300' : ''}`}
                                disabledClassName="text-gray-50 cursor-not-allowed"
                                activeLinkClassName="text-stone-600 font-extrabold"
                                previousLabel={<span className="flex items-center justify-center px-2 h-10 text-gray-500 hover:text-gray-700">Previous</span>}
                                nextLabel={<span className="flex items-center justify-center px-2 h-10 text-gray-500 hover:text-gray-700">Next</span>}
                                breakLabel={<span className="flex items-center justify-center px-4 h-10 text-gray-500 bg-white border border-gray-300">...</span>}
                                pageClassName="flex items-center justify-center px-1 h-10 text-gray-500 border border-gray-300 cursor-pointer bg-white"
                                pageLinkClassName="flex items-center justify-center px-3 h-10 text-gray-500 cursor-pointer"
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SlideshowPage;