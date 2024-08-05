import UploadIcon from '@mui/icons-material/Upload';
import { Box, Modal, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, OutlinedBrownButton, VisuallyHiddenInput } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';

const EditCategoryModal = ({ open, onClose, category, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        if (category) {
            setName(category.name);
            if (category.image) {
                setImagePreview(`http://localhost:5000/${category.image}`);
            } else {
                setImagePreview('');
            }
        }
    }, [category]);

    const handleEditCategory = async () => {
        const formData = new FormData();
        formData.append('name', name);
        if (image) {
            formData.append('image', image);
        }

        try {
            await axiosInstance.put(`/categories/update/${category._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Category updated successfully');
            onEditSuccess();
            onClose();
        } catch (error) {
            console.error('Error updating category', error);
            toast.error('Error updating category');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
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
                <Typography variant='h5' className="!text-xl !font-bold !mb-2">Edit Category</Typography>
                <BrownOutlinedTextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    onClick={handleEditCategory}
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

export default EditCategoryModal;
