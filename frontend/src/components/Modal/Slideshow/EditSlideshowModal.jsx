import { Upload } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ActionButtons, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError, OutlinedBrownButton, VisuallyHiddenInput } from '../../../assets/CustomComponents';
import useAxios from '../../../utils/axiosInstance';
import { getImageUrl } from '../../../utils/config';

const EditSlideshowModal = ({ open, onClose, image, onViewDetails, onEditSuccess }) => {
    const [title, setTitle] = useState('');
    const [isValidTitle, setIsValidTitle] = useState(true);
    const [description, setDescription] = useState('');
    const [isValidDescription, setIsValidDescription] = useState(true);
    const [newImage, setNewImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const axiosInstance = useAxios();

    const isValid = (v) => /^[A-Z][\sa-zA-Z\W]{3,15}$/.test(v);

    const isValidForm = title && isValidTitle && description && isValidDescription && (newImage || image?.image);

    useEffect(() => {
        if (image) {
            setTitle(image.title);
            setDescription(image.description);
            if (image.image) {
                setImagePreview(getImageUrl(image.image));
            } else {
                setImagePreview('');
            }
        }
    }, [image]);

    const handleEditImage = async () => {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        if (newImage) {
            formData.append('image', newImage);
        }

        try {
            const response = await axiosInstance.put(`/slideshow/update/${image._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success(response.data.message);
            onEditSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error updating image');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (validTypes.includes(file.type)) {
                setNewImage(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                toast.error('Invalid file type. Please upload an image (jpeg, jpg, or png)');
                console.error('Invalid file type. Please upload an image (jpeg, jpg, or png)');
            }
        }
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
                <OutlinedBrownButton
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<Upload />}
                    className="w-full !mb-6"
                >
                    Upload image
                    <VisuallyHiddenInput type="file" onChange={handleImageChange} />
                </OutlinedBrownButton>
                {imagePreview && (
                    <div className="mb-4">
                        <img src={imagePreview} alt="Preview" className="max-w-full h-auto mx-auto rounded-md" />
                    </div>
                )}

                <ActionButtons
                    primaryButtonLabel="Save"
                    secondaryButtonLabel="View Details"
                    onPrimaryClick={handleEditImage}
                    onSecondaryClick={() => {
                        onViewDetails(image);
                        onClose();
                    }}
                    primaryButtonProps={{
                        disabled: !isValidForm
                    }}
                />
            </CustomBox>
        </CustomModal>
    );
};

export default EditSlideshowModal;
