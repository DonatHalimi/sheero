import { InputLabel, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ActionButtons, CustomBox, CustomModal, CustomTextField, CustomTypography, handleApiError, ImageUploadBox, OutlinedBrownFormControl } from '../../../assets/CustomComponents';
import { getCategoriesService } from '../../../services/categoryService';
import { editSubcategoryService } from '../../../services/subcategoryService';
import { getImageUrl } from '../../../utils/config';
import { SubcategoryValidations } from '../../../utils/validations/subcategory';

const EditSubcategoryModal = ({ open, onClose, subcategory, onViewDetails, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [hasExistingImage, setHasExistingImage] = useState(false);
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const validateName = (v) => SubcategoryValidations.nameRules.pattern.test(v);

    const isFormValid = name && validateName(name) && category && (image || hasExistingImage);

    useEffect(() => {
        if (subcategory) {
            setName(subcategory.name || '');
            setCategory(subcategory.category?._id || '');
            setImage(null);
            setHasExistingImage(!!subcategory.image);
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
        setHasExistingImage(!!file);
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit Subcategory</CustomTypography>

                <CustomTextField
                    label="Name"
                    value={name}
                    setValue={setName}
                    validate={validateName}
                    validationRule={SubcategoryValidations.nameRules}
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
                        disabled: !isFormValid || loading,
                    }}
                    loading={loading}
                />
            </CustomBox>
        </CustomModal>
    );
};

export default EditSubcategoryModal;