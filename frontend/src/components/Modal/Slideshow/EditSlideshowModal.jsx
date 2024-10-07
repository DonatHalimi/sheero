import UploadIcon from '@mui/icons-material/Upload';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, OutlinedBrownButton, VisuallyHiddenInput } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';

const EditSlideshowModal = ({ open, onClose, image, onEditSuccess }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [newImage, setNewImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        if (image) {
            setTitle(image.title);
            setDescription(image.description);
            if (image.image) {
                setImagePreview(`http://localhost:5000/${image.image}`);
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
            console.error('Error updating slideshow image', error);
            toast.error('Error updating slideshow image');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setNewImage(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit Slideshow Image</CustomTypography>

                <BrownOutlinedTextField
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    fullWidth
                    margin="normal"
                    className='!mb-4'
                />
                <BrownOutlinedTextField
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    fullWidth
                    margin="normal"
                    className='!mb-4'
                />
                <OutlinedBrownButton
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<UploadIcon />}
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
                    onClick={handleEditImage}
                    variant="contained"
                    color="primary"
                    className="w-full"
                >
                    Update
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default EditSlideshowModal;
