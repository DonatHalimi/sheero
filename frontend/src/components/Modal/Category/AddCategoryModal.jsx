import UploadIcon from '@mui/icons-material/Upload';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, OutlinedBrownButton, VisuallyHiddenInput } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';

const AddCategoryModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const axiosInstance = useAxios();

    const handleAddCategory = async () => {
        if (!name || !image) {
            toast.error('Please fill in all the fields');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('image', image);

        try {
            const response = await axiosInstance.post('/categories/create', formData);
            toast.success(response.data.message);
            onAddSuccess(response.data);
            onClose();
        } catch (error) {
            console.error('Error adding category', error);
            toast.error('Error adding category');
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
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
                <CustomTypography variant="h5">Add Category</CustomTypography>

                <BrownOutlinedTextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
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
                    onClick={handleAddCategory}
                    variant="contained"
                    color="primary"
                    className="w-full"
                >
                    Add
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddCategoryModal;
