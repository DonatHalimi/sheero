import { Upload } from '@mui/icons-material';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError, OutlinedBrownButton, VisuallyHiddenInput } from '../../../assets/CustomComponents';
import useAxios from '../../../utils/axiosInstance';

const AddSlideshowModal = ({ open, onClose, onAddSuccess }) => {
    const [title, setTitle] = useState('');
    const [isValidTitle, setIsValidTitle] = useState(true);
    const [description, setDescription] = useState('');
    const [isValidDescription, setIsValidDescription] = useState(true);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const axiosInstance = useAxios();

    const isValid = (v) => /^[A-Z][\sa-zA-Z\W]{3,15}$/.test(v);

    const isValidForm = title && isValidTitle && description && isValidDescription && image;

    const handleAddImage = async () => {
        if (!title || !image) {
            toast.error('Please fill in all the fields');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('image', image);

        try {
            const response = await axiosInstance.post('/slideshow/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success(response.data.message);
            onAddSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error adding image');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            if (validTypes.includes(file.type)) {
                setImage(file);
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else {
                toast.error('Invalid file type. Please upload an image (jpeg, jpg or png)');
                console.error('Invalid file type. Please upload an image (jpeg, jpg or png)');
            }
        }
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
                <BrownButton
                    onClick={handleAddImage}
                    variant="contained"
                    color="primary"
                    disabled={!isValidForm}
                    className="w-full"
                >
                    Add
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddSlideshowModal;
