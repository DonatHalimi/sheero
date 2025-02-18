import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError, ImageUploadBox, LoadingLabel } from '../../../assets/CustomComponents';
import { addSlideshowService } from '../../../services/slideshowService';

const AddSlideshowModal = ({ open, onClose, onAddSuccess }) => {
    const [title, setTitle] = useState('');
    const [isValidTitle, setIsValidTitle] = useState(true);
    const [description, setDescription] = useState('');
    const [isValidDescription, setIsValidDescription] = useState(true);
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const isValid = (v) => /^[A-Z][\sa-zA-Z\W]{3,15}$/.test(v);

    const isValidForm = title && isValidTitle && description && isValidDescription && image;

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
        setImage(file); // Update the image state in the parent component
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Add Slideshow Image</CustomTypography>

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
                <ImageUploadBox onFileSelect={handleFileSelect} />
                <BrownButton
                    onClick={handleAddImage}
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

export default AddSlideshowModal;