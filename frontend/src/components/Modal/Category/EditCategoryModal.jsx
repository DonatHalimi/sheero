import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ActionButtons, CustomBox, CustomModal, CustomTextField, CustomTypography, handleApiError, ImageUploadBox } from '../../../assets/CustomComponents';
import { editCategoryService } from '../../../services/categoryService';
import { getImageUrl } from '../../../utils/config';
import { CategoryValidations } from '../../../utils/validations/category';

const EditCategoryModal = ({ open, onClose, category, onViewDetails, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [hasExistingImage, setHasExistingImage] = useState(false);
    const [loading, setLoading] = useState(false);

    const validateName = (v) => CategoryValidations.nameRules.pattern.test(v);

    const isFormValid = validateName(name) && (image || hasExistingImage);

    useEffect(() => {
        if (category) {
            setName(category.name);
            setImage(null);
            setHasExistingImage(!!category.image);
        }
    }, [category]);

    const handleEditCategory = async () => {
        setLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await editCategoryService(category._id, formData);
            toast.success(response.data.message);
            onEditSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error updating category');
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
                <CustomTypography variant="h5">Edit Category</CustomTypography>

                <CustomTextField
                    label="Name"
                    value={name}
                    setValue={setName}
                    validate={validateName}
                    validationRule={CategoryValidations.nameRules}
                />

                <ImageUploadBox onFileSelect={handleFileSelect} initialPreview={category?.image ? getImageUrl(category.image) : ''} />

                <ActionButtons
                    primaryButtonLabel="Save"
                    secondaryButtonLabel="View Details"
                    onPrimaryClick={handleEditCategory}
                    onSecondaryClick={() => {
                        onViewDetails(category);
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

export default EditCategoryModal;
