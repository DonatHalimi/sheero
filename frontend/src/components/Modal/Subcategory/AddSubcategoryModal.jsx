import UploadIcon from '@mui/icons-material/Upload';
import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomPaper, CustomTypography, OutlinedBrownButton, VisuallyHiddenInput } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';

const AddSubcategoryModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [category, setCategory] = useState(null);
    const [categories, setCategories] = useState([]);

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

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
    }, [axiosInstance]);

    const handleAddSubcategory = async () => {
        if (!name || !image || !category) {
            toast.error('Please fill in all the fields', {
                closeOnClick: true
            });
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('image', image);
        formData.append('category', category._id);

        try {
            await axiosInstance.post('/subcategories/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Subcategory added successfully');
            onAddSuccess();
            onClose();
        } catch (error) {
            console.error('Error adding subcategory', error);
            toast.error('Error adding subcategory');
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
                <CustomTypography variant="h5">Add Subcategory</CustomTypography>

                <BrownOutlinedTextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
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
                    onClick={handleAddSubcategory}
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

export default AddSubcategoryModal;
