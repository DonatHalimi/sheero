import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError, ImageUploadBox, LoadingLabel } from '../../../assets/CustomComponents';
import { addCategoryService } from '../../../services/categoryService';

const AddCategoryModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [isValidName, setIsValidName] = useState(true);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const validateName = (v) => /^[A-ZÇ][\sa-zA-ZëËçÇ\W]{3,28}$/.test(v);

    const isValidForm = isValidName && image;

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

                <BrownOutlinedTextField
                    label="Name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                        setIsValidName(validateName(e.target.value));
                    }}
                    error={!isValidName}
                    helperText={!isValidName ? 'Name must start with a capital letter and be 3-28 characters long' : ''}
                    fullWidth
                    className='!mb-4'
                />

                <ImageUploadBox onFileSelect={handleFileSelect} />

                <BrownButton
                    onClick={handleAddCategory}
                    variant="contained"
                    color="primary"
                    disabled={!isValidForm || loading}
                    className="w-full"
                >
                    <LoadingLabel loading={loading} />
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddCategoryModal;
