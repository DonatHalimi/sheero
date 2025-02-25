import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ActionButtons, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError, ImageUploadBox } from '../../../assets/CustomComponents';
import { editSlideshowService } from '../../../services/slideshowService';
import { getImageUrl } from '../../../utils/config';

const EditSlideshowModal = ({ open, onClose, image, onViewDetails, onEditSuccess }) => {
    const [title, setTitle] = useState('');
    const [isValidTitle, setIsValidTitle] = useState(true);
    const [description, setDescription] = useState('');
    const [isValidDescription, setIsValidDescription] = useState(true);
    const [newImage, setNewImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const isValid = (v) => /^[A-Z][\sa-zA-Z\W]{3,15}$/.test(v);

    const isValidForm = title && isValidTitle && description && isValidDescription && (newImage || image?.image);

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

                <BrownOutlinedTextField
                    label="Title"
                    value={title}
                    fullWidth
                    onChange={(e) => {
                        setTitle(e.target.value);
                        setIsValidTitle(isValid(e.target.value));
                    }}
                    error={!isValidTitle}
                    helperText={!isValidTitle ? 'Title must start with a capital letter and be 3-15 characters long' : ''}
                    className='!mb-4'
                />
                <BrownOutlinedTextField
                    label="Description"
                    value={description}
                    fullWidth
                    onChange={(e) => {
                        setDescription(e.target.value);
                        setIsValidDescription(isValid(e.target.value));
                    }}
                    error={!isValidDescription}
                    helperText={!isValidDescription ? 'Description must start with a capital letter and be 3-15 characters long' : ''}
                    className='!mb-4'
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
                        disabled: !isValidForm || loading,
                    }}
                    loading={loading}
                />
            </CustomBox>
        </CustomModal>
    );
};

export default EditSlideshowModal;
