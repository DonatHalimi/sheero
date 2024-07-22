import UploadIcon from '@mui/icons-material/Upload';
import { Box, Modal, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';
import { BrownButton, BrownOutlinedTextField, OutlinedBrownButton, VisuallyHiddenInput } from '../../Dashboard/CustomComponents';

const EditSlideshowModal = ({ open, onClose, image, onEditSuccess }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [newImage, setNewImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        if (image) {
            setTitle(image.title);
            setDescription(image.description);
            if (image.image) {
                setImagePreview(`http://localhost:5000/${image.image}`);
            } else {
                setImagePreview('');
            }
        }
    }, [image]);

    const handleEditImage = async () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (newImage) {
            formData.append('image', newImage);
        }

        try {
            await axiosInstance.put(`/slideshow/update/${image._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Slideshow image updated successfully');
            onEditSuccess();
            onClose();
        } catch (error) {
            console.error('Error updating slideshow image', error);
            toast.error('Error updating slideshow image');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setNewImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Modal open={open} onClose={onClose} className='flex items-center justify-center'>
            <Box className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
                <Typography variant='h5' className="!text-xl !font-bold !mb-6">Edit Slideshow Image</Typography>
                <BrownOutlinedTextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    margin="normal"
                    className='!mb-4'
                />
                <BrownOutlinedTextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                    className='!mb-4'
                />
                <OutlinedBrownButton
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<UploadIcon />}
                    className="w-full !mb-6"
                >
                    Upload image
                    <VisuallyHiddenInput type="file" onChange={handleImageChange} />
                </OutlinedBrownButton>
                {imagePreview && (
                    <div className="mb-4">
                        <img src={imagePreview} alt="Preview" className="max-w-full h-auto mx-auto rounded-md" />
                    </div>
                )}
                <BrownButton
                    onClick={handleEditImage}
                    variant="contained"
                    color="primary"
                    className="w-full"
                >
                    Update
                </BrownButton>
            </Box>
        </Modal>
    );
};

export default EditSlideshowModal;
