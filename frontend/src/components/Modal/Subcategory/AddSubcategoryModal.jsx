import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, CustomBox, CustomModal, CustomPaper, CustomTextField, CustomTypography, handleApiError, ImageUploadBox, LoadingLabel } from '../../../assets/CustomComponents';
import { getCategoriesService } from '../../../services/categoryService';
import { addSubcategoryService } from '../../../services/subcategoryService';
import { SubcategoryValidations } from '../../../utils/validations/subcategory';

const AddSubcategoryModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [category, setCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const validateName = (v) => SubcategoryValidations.nameRules.pattern.test(v);

    const isFormValid = name && validateName(name) && image && category;

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

                <CustomTextField
                    label="Name"
                    value={name}
                    setValue={setName}
                    validate={validateName}
                    validationRule={SubcategoryValidations.nameRules}
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
                    disabled={!isFormValid || loading}
                    className="w-full"
                >
                    <LoadingLabel loading={loading} />
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddSubcategoryModal;
