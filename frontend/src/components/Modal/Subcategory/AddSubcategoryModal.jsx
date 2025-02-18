import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomPaper, CustomTypography, handleApiError, ImageUploadBox, LoadingLabel, OutlinedBrownButton, VisuallyHiddenInput } from '../../../assets/CustomComponents';
import { getCategoriesService } from '../../../services/categoryService';
import { addSubcategoryService } from '../../../services/subcategoryService';

const AddSubcategoryModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [isValidName, setIsValidName] = useState(true);
    const [image, setImage] = useState(null);
    const [category, setCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const validateName = (v) => /^[A-ZÇ][\sa-zA-ZëËçÇ\W]{3,27}$/.test(v);

    const isValidForm = name && isValidName && image && category;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategoriesService();
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
        setLoading(true);

        if (!name || !image || !category) {
            toast.error('Please fill in all the fields');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('image', image);
        formData.append('category', category._id);

        try {
            const response = await addSubcategoryService(formData);
            toast.success(response.data.message);
            onAddSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error adding subcategory');
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

                <ImageUploadBox onFileSelect={handleFileSelect} />

                <BrownButton
                    onClick={handleAddSubcategory}
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

export default AddSubcategoryModal;
