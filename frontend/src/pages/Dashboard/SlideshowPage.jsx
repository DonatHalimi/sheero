import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
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
    const [fetchErrorCount, setFetchErrorCount] = useState(0);

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axiosInstance.get('/slideshow/get');
                setImages(response.data);
                setFetchErrorCount(0);
            } catch (error) {
                setFetchErrorCount(prevCount => {
                    if (prevCount < 5) {
                        toast.error('Error fetching images');
                    }
                    return prevCount + 1;
                });
                console.error('Error fetching images', error);
            }
        };
        fetchImages();

    }, [addImageOpen, editImageOpen, deleteImageOpen, axiosInstance]);

    const refreshImages = async () => {
        try {
            const response = await axiosInstance.get('/slideshow/get');
            setImages(response.data);
            setFetchErrorCount(0);
        } catch (error) {
            setFetchErrorCount(prevCount => {
                if (prevCount < 5) {
                    toast.error('Error fetching images');
                }
                return prevCount + 1;
            });
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
                                {images && images.length > 0 ? (
                                    images.map((image) => (
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

                    <AddSlideshowModal open={addImageOpen} onClose={() => setAddImageOpen(false)} onAddSuccess={refreshImages} />
                    <EditSlideshowModal open={editImageOpen} onClose={() => setEditImageOpen(false)} image={selectedImage} onEditSuccess={refreshImages} />
                    <DeleteSlideshowModal open={deleteImageOpen} onClose={() => setDeleteImageOpen(false)} images={selectedImages.map(id => images.find(image => image._id === id))} onDeleteSuccess={refreshImages} />
                </div>
            </div>
        </>
    );
};

export default SlideshowPage;
