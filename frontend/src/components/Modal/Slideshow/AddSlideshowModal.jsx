import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, CustomBox, CustomModal, CustomTextField, CustomTypography, handleApiError, ImageUploadBox, LoadingLabel } from '../../../assets/CustomComponents';
import { addSlideshowService } from '../../../services/slideshowService';
import { SlideshowValidations } from '../../../utils/validations/slideshow';

const AddSlideshowModal = ({ open, onClose, onAddSuccess }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const validateTitle = (v) => SlideshowValidations.titleRules.pattern.test(v);
    const validateDescription = (v) => SlideshowValidations.descriptionRules.pattern.test(v);

    const isFormValid = title && validateTitle(title) && description && validateDescription(description) && image;

    const handleAddImage = async () => {
        setLoading(true);

        if (!title || !image) {
            toast.error('Please fill in all the fields');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('image', image);

        try {
            const response = await addSlideshowService(formData);
            toast.success(response.data.message);
            onAddSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error adding image');
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
                <CustomTypography variant="h5">Add Slideshow Image</CustomTypography>

                <CustomTextField
                    label="Title"
                    value={title}
                    setValue={setTitle}
                    validate={validateTitle}
                    validationRule={SlideshowValidations.titleRules}
                />

                <CustomTextField
                    label="Description"
                    value={description}
                    setValue={setDescription}
                    validate={validateDescription}
                    validationRule={SlideshowValidations.descriptionRules}
                />

                <ImageUploadBox onFileSelect={handleFileSelect} />

                <BrownButton
                    onClick={handleAddImage}
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

export default AddSlideshowModal;