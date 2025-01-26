import { Upload } from '@mui/icons-material';
import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomPaper, CustomTypography, handleApiError, OutlinedBrownButton, VisuallyHiddenInput } from '../../../assets/CustomComponents';
import useAxios from '../../../utils/axiosInstance';

const AddSubcategoryModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [isValidName, setIsValidName] = useState(true);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [category, setCategory] = useState(null);
    const [categories, setCategories] = useState([]);

    const axiosInstance = useAxios();

    const validateName = (v) => /^[A-ZÇ][\sa-zA-ZëËçÇ\W]{3,27}$/.test(v);

    const isValidForm = name && isValidName && image && category;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/categories/get');
                const categoriesWithGroups = response.data.map(category => ({
                    ...category,
                    firstLetter: category.name[0].toUpperCase()
                }));
                setCategories(categoriesWithGroups);
            } catch (error) {
                console.error('Error fetching categories', error);
                toast.error('Error fetching categories');
            }
        };

        fetchCategories();
    }, []);

    const handleAddSubcategory = async () => {
        if (!name || !image || !category) {
            toast.error('Please fill in all the fields');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('image', image);
        formData.append('category', category._id);

        try {
            const response = await axiosInstance.post('/subcategories/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success(response.data.message);
            onAddSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error adding subcategory');
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
                <CustomTypography variant="h5">Add Subcategory</CustomTypography>

                <BrownOutlinedTextField
                    label="Name"
                    value={name}
                    fullWidth
                    onChange={(e) => {
                        setName(e.target.value)
                        setIsValidName(validateName(e.target.value));
                    }}
                    error={!isValidName}
                    helperText={!isValidName ? 'Name must start with a capital letter and be 3-27 characters long' : ''}
                    className='!mb-4'
                />
                <Autocomplete
                    id="category-autocomplete"
                    options={categories.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                    groupBy={(option) => option.firstLetter}
                    getOptionLabel={(option) => option.name}
                    value={category}
                    onChange={(event, newValue) => setCategory(newValue)}
                    PaperComponent={CustomPaper}
                    fullWidth
                    renderInput={(params) => <TextField {...params} label="Category" variant="outlined" />}
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
                    onClick={handleAddSubcategory}
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

export default AddSubcategoryModal;
