import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ActionButtons, CustomBox, CustomModal, CustomTextField, CustomTypography, handleApiError, ImageUploadBox } from '../../../assets/CustomComponents';
import { editSlideshowService } from '../../../services/slideshowService';
import { getImageUrl } from '../../../utils/config';
import { SlideshowValidations } from '../../../utils/validations/slideshow';

const EditSlideshowModal = ({ open, onClose, image, onViewDetails, onEditSuccess }) => {
    const [title, setTitle] = useState('');
    const [isValidTitle, setIsValidTitle] = useState(true);
    const [description, setDescription] = useState('');
    const [isValidDescription, setIsValidDescription] = useState(true);
    const [newImage, setNewImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const validateTitle = (v) => SlideshowValidations.titleRules.pattern.test(v);
    const validateDescription = (v) => SlideshowValidations.descriptionRules.pattern.test(v);

    const isFormValid = title && validateTitle(title) && description && validateDescription(description) && image;

    useEffect(() => {
        if (image) {
            setTitle(image.title);
            setDescription(image.description);
            setNewImage(null);
        }
    }, [image]);

    const handleEditImage = async () => {
        setLoading(true);

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (newImage) {
            formData.append('image', newImage);
        }

        try {
            const response = await editSlideshowService(image._id, formData);
            toast.success(response.data.message);
            onEditSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error updating image');
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (file) => {
        setNewImage(file);
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit Slideshow Image</CustomTypography>

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

                <ImageUploadBox onFileSelect={handleFileSelect} initialPreview={image?.image ? getImageUrl(image.image) : ''} />

                <ActionButtons
                    primaryButtonLabel="Save"
                    secondaryButtonLabel="View Details"
                    onPrimaryClick={handleEditImage}
                    onSecondaryClick={() => {
                        onViewDetails(image);
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

export default EditSlideshowModal;
