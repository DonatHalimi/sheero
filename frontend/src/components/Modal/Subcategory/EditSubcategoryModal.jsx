import UploadIcon from '@mui/icons-material/Upload';
import { InputLabel, MenuItem, Select } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, OutlinedBrownButton, OutlinedBrownFormControl, VisuallyHiddenInput } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';

const EditSubcategoryModal = ({ open, onClose, subcategory, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        if (subcategory) {
            setName(subcategory.name || '');
            setCategory(subcategory.category?._id || '');
            setImagePreview(subcategory.image ? `http://localhost:5000/${subcategory.image}` : '');
        }
    }, [subcategory]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/categories/get');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories', error);
                toast.error('Error fetching categories');
            }
        };

        fetchCategories();
    }, [axiosInstance]);

    const handleEditSubcategory = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('category', category);
        if (image) {
            formData.append('image', image);
        }

        try {
            await axiosInstance.put(`/subcategories/update/${subcategory._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success('Subcategory updated successfully');
            onEditSuccess();
            onClose();
        } catch (error) {
            console.error('Error updating subcategory', error);
            toast.error('Error updating subcategory');
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
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit Subcategory</CustomTypography>

                <BrownOutlinedTextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    className="!mb-4"
                />
                <OutlinedBrownFormControl fullWidth margin="normal">
                    <InputLabel>Category</InputLabel>
                    <Select
                        label="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="!mb-4"
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat._id} value={cat._id}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </Select>
                </OutlinedBrownFormControl>
                <OutlinedBrownButton
                    component="label"
                    variant="contained"
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
                <BrownButton onClick={handleEditSubcategory} variant="contained" color="primary" className="w-full">
                    Save Changes
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default EditSubcategoryModal;