import UploadIcon from '@mui/icons-material/Upload';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError, OutlinedBrownButton, VisuallyHiddenInput } from '../../../assets/CustomComponents';
import useAxios from '../../../utils/axiosInstance';
import { getImageUrl } from '../../../utils/config';

const EditCategoryModal = ({ open, onClose, category, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [isValidName, setIsValidName] = useState(true);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    const axiosInstance = useAxios();

    const validateName = (v) => /^[A-Z][\sa-zA-Z\W]{3,28}$/.test(v);

    const isValidForm = isValidName && name || image;

    useEffect(() => {
        if (category) {
            setName(category.name);
            if (category.image) {
                setImagePreview(getImageUrl(category.image));
            } else {
                setImagePreview('');
            }
        }
    }, [category]);

    const handleEditCategory = async () => {
        const formData = new FormData();
        formData.append('name', name);
        if (image) {
            formData.append('image', image);
        }

        try {
            const response = await axiosInstance.put(`/categories/update/${category._id}`, formData);
            toast.success(response.data.message);
            onEditSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error updating category');
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
                <CustomTypography variant="h5">Edit Category</CustomTypography>

                <BrownOutlinedTextField
                    label="Name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                        setIsValidName(validateName(e.target.value));
                    }}
                    fullWidth
                    margin="normal"
                    error={!isValidName}
                    helperText={!isValidName ? 'Name must start with a capital letter and be 3-28 characters long' : ''}
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
                    onClick={handleEditCategory}
                    variant="contained"
                    color="primary"
                    disabled={!isValidForm}
                    className="w-full"
                >
                    Update
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default EditCategoryModal;
