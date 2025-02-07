import { Upload } from '@mui/icons-material';
import { InputLabel, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ActionButtons, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError, OutlinedBrownButton, OutlinedBrownFormControl, VisuallyHiddenInput } from '../../../assets/CustomComponents';
import { getCategoriesService } from '../../../services/categoryService';
import { editSubcategoryService } from '../../../services/subcategoryService';
import { getImageUrl } from '../../../utils/config';

const EditSubcategoryModal = ({ open, onClose, subcategory, onViewDetails, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [isValidName, setIsValidName] = useState(true);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const validateName = (v) => /^[A-ZÇ][\sa-zA-ZëËçÇ\W]{3,27}$/.test(v);

    const isValidForm = name && isValidName && category;

    useEffect(() => {
        if (subcategory) {
            setName(subcategory.name || '');
            setCategory(subcategory.category?._id || '');
            setImagePreview(subcategory.image ? getImageUrl(subcategory.image) : '');
        }
    }, [subcategory]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategoriesService();
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories', error);
                toast.error('Error fetching categories');
            }
        };

        fetchCategories();
    }, []);

    const handleEditSubcategory = async () => {
        setLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('category', category);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await editSubcategoryService(subcategory._id, formData);
            toast.success(response.data.message);
            onEditSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error updating subcategory');
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (validTypes.includes(file.type)) {
                setImage(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                toast.error('Invalid file type. Please upload an image (jpeg, jpg, or png)');
                console.error('Invalid file type. Please upload an image (jpeg, jpg, or png)');
            }
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit Subcategory</CustomTypography>

                <BrownOutlinedTextField
                    label="Name"
                    value={name}
                    fullWidth
                    onChange={(e) => {
                        setName(e.target.value)
                        setIsValidName(validateName(e.target.value));
                    }}
                    error={!isValidName}
                    helperText={!isValidName ? 'Name must start with a capital letter and be 3-27 characters long' : ''}
                    className="!mb-4"
                />
                <OutlinedBrownFormControl fullWidth>
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
                    startIcon={<Upload />}
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

                <ActionButtons
                    primaryButtonLabel="Save"
                    secondaryButtonLabel="View Details"
                    onPrimaryClick={handleEditSubcategory}
                    onSecondaryClick={() => {
                        onViewDetails(subcategory);
                        onClose();
                    }}
                    primaryButtonProps={{
                        disabled: !isValidForm || loading,
                    }}
                    loading={loading}
                />
            </CustomBox>
        </CustomModal>
    );
};

export default EditSubcategoryModal;