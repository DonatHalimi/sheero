import { InputLabel, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ActionButtons, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError, ImageUploadBox, OutlinedBrownFormControl } from '../../../assets/CustomComponents';
import { getCategoriesService } from '../../../services/categoryService';
import { editSubcategoryService } from '../../../services/subcategoryService';
import { getImageUrl } from '../../../utils/config';

const EditSubcategoryModal = ({ open, onClose, subcategory, onViewDetails, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [isValidName, setIsValidName] = useState(true);
    const [image, setImage] = useState(null);
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const validateName = (v) => /^[A-ZÇ][\sa-zA-ZëËçÇ\W]{3,27}$/.test(v);

    const isValidForm = name && isValidName && category;

    useEffect(() => {
        if (subcategory) {
            setName(subcategory.name || '');
            setCategory(subcategory.category?._id || '');
            setImage(null);
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

    const handleFileSelect = (file) => {
        setImage(file);
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

                <ImageUploadBox onFileSelect={handleFileSelect} initialPreview={subcategory?.image ? getImageUrl(subcategory.image) : ''} />

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