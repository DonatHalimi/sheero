import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ActionButtons, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError, ImageUploadBox, OutlinedBrownButton, VisuallyHiddenInput } from '../../../assets/CustomComponents';
import { editCategoryService } from '../../../services/categoryService';
import { getImageUrl } from '../../../utils/config';

const EditCategoryModal = ({ open, onClose, category, onViewDetails, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [isValidName, setIsValidName] = useState(true);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const validateName = (v) => /^[A-ZÇ][\sa-zA-ZëËçÇ\W]{3,28}$/.test(v);

    const isValidForm = isValidName && name || image;

    useEffect(() => {
        if (category) {
            setName(category.name);
            setIsValidName(true);
            setImage(null);
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
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit Category</CustomTypography>

                <BrownOutlinedTextField
                    label="Name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setIsValidName(validateName(e.target.value));
                    }}
                    error={!isValidName}
                    helperText={!isValidName ? 'Name must start with a capital letter and be 3-28 characters long' : ''}
                    fullWidth
                    className='!mb-4'
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
                        disabled: !isValidForm || loading,
                    }}
                    loading={loading}
                />
            </CustomBox>
        </CustomModal>
    );
};

export default EditCategoryModal;
