import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, CustomBox, CustomModal, CustomTextField, CustomTypography, handleApiError, ImageUploadBox, LoadingLabel } from '../../../assets/CustomComponents';
import { addCategoryService } from '../../../services/categoryService';
import { CategoryValidations } from '../../../utils/validations/category';

const AddCategoryModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const validateName = (v) => CategoryValidations.nameRules.pattern.test(v);

    const isFormValid = validateName(name) && image;

    const handleAddCategory = async () => {
        setLoading(true);

        if (!name || !image) {
            toast.error('Please fill in all the fields');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('image', image);

        try {
            const response = await addCategoryService(formData);
            toast.success(response.data.message);
            onAddSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error adding category');
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
                <CustomTypography variant="h5">Add Category</CustomTypography>

                <CustomTextField
                    label="Name"
                    value={name}
                    setValue={setName}
                    validate={validateName}
                    validationRule={CategoryValidations.nameRules}
                />

                <ImageUploadBox onFileSelect={handleFileSelect} />

                <BrownButton
                    onClick={handleAddCategory}
                    variant="contained"
                    color="primary"
                    disabled={!isFormValid || loading}
                    className="w-full"
                >
                    <LoadingLabel loading={loading} />
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddCategoryModal;
