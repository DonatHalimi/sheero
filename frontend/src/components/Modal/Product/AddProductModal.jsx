import UploadIcon from '@mui/icons-material/Upload';
import { Box, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';
import { BrownButton, BrownOutlinedTextField, OutlinedBrownButton, OutlinedBrownFormControl, VisuallyHiddenInput } from '../../Dashboard/CustomComponents';

const AddProductModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [inventoryCount, setInventoryCount] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [length, setLength] = useState('');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [unit, setUnit] = useState('cm');
    const [variants, setVariants] = useState([{ color: '', size: '' }]);

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        const fetchCategoriesAndSubcategories = async () => {
            try {
                const categoriesResponse = await axiosInstance.get('/categories/get');
                const subcategoriesResponse = await axiosInstance.get('/subcategories/get');
                setCategories(categoriesResponse.data);
                setSubcategories(subcategoriesResponse.data);
            } catch (error) {
                console.error('Error fetching categories and subcategories', error);
            }
        };

        fetchCategoriesAndSubcategories();
    }, [axiosInstance]);

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

    const handleAddProduct = async () => {
        if (!name || !description || !price || !category || !subcategory || !inventoryCount || !image) {
            toast.error('Please fill in all the fields', {
                closeOnClick: true
            });
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('salePrice', salePrice);
        formData.append('category', category);
        formData.append('subcategory', subcategory);
        formData.append('inventoryCount', inventoryCount);
        formData.append('image', image);
        formData.append('dimensions[length]', length);
        formData.append('dimensions[width]', width);
        formData.append('dimensions[height]', height);
        formData.append('dimensions[unit]', unit);
        variants.forEach((variant, index) => {
            formData.append(`variants[${index}][color]`, variant.color);
            formData.append(`variants[${index}][size]`, variant.size);
        });

        try {
            await axiosInstance.post('/products/create', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Product added successfully');
            onAddSuccess();
            onClose();
        } catch (error) {
            toast.error('Error adding product');
            console.error('Error adding product', error);
        }
    };

    const handleVariantChange = (index, key, value) => {
        const newVariants = [...variants];
        newVariants[index][key] = value;
        setVariants(newVariants);
    };

    const addVariant = () => {
        setVariants([...variants, { color: '', size: '' }]);
    };

    const removeVariant = (index) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div className="flex items-center justify-center h-screen">
                <Box className="edit-modal bg-white p-4 rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
                    <Typography variant='h5' className="!text-xl !font-bold !mb-6">Add Product</Typography>
                    <BrownOutlinedTextField
                        fullWidth
                        required
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="!mb-4"
                    />
                    <BrownOutlinedTextField
                        fullWidth
                        required
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="!mb-4"
                    />
                    <Box className="flex gap-4 mb-2">
                        <BrownOutlinedTextField
                            fullWidth
                            required
                            label="Price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="!mb-4"
                        />
                        <BrownOutlinedTextField
                            fullWidth
                            label="Sale Price"
                            value={salePrice}
                            onChange={(e) => setSalePrice(e.target.value)}
                            className="!mb-4"
                        />
                    </Box>
                    <BrownOutlinedTextField
                        fullWidth
                        required
                        label="Inventory Count"
                        value={inventoryCount}
                        onChange={(e) => setInventoryCount(e.target.value)}
                        className="!mb-4"
                    />
                    <Box className="flex gap-4 mb-4">
                        <OutlinedBrownFormControl className="flex-1">
                            <InputLabel>Category</InputLabel>
                            <Select
                                label="Category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {categories.map((cat) => (
                                    <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                                ))}
                            </Select>
                        </OutlinedBrownFormControl>
                        <OutlinedBrownFormControl className="flex-1">
                            <InputLabel>Subcategory</InputLabel>
                            <Select
                                label="Subcategory"
                                value={subcategory}
                                onChange={(e) => setSubcategory(e.target.value)}
                            >
                                {subcategories.map((sub) => (
                                    <MenuItem key={sub._id} value={sub._id}>{sub.name}</MenuItem>
                                ))}
                            </Select>
                        </OutlinedBrownFormControl>
                    </Box>
                    <Typography variant='h6' className="!text-lg !font-bold !mb-2">Dimensions</Typography>
                    <Box className="flex gap-4 mb-4">
                        <BrownOutlinedTextField
                            fullWidth
                            label="Length"
                            value={length}
                            onChange={(e) => setLength(e.target.value)}
                            className="!mb-4"
                        />
                        <BrownOutlinedTextField
                            fullWidth
                            label="Width"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                            className="!mb-4"
                        />
                        <BrownOutlinedTextField
                            fullWidth
                            label="Height"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="!mb-4"
                        />
                        <BrownOutlinedTextField
                            fullWidth
                            label="Unit"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            className="!mb-4"
                        />
                    </Box>
                    <Typography variant='h6' className="!text-lg !font-bold !mb-2">Variants</Typography>
                    {variants.map((variant, index) => (
                        <Box key={index} className="flex gap-4 mb-2">
                            <BrownOutlinedTextField
                                fullWidth
                                label="Color"
                                value={variant.color}
                                onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                            />
                            <BrownOutlinedTextField
                                fullWidth
                                label="Size"
                                value={variant.size}
                                onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                            />
                            <OutlinedBrownButton onClick={() => removeVariant(index)}>Remove</OutlinedBrownButton>
                        </Box>
                    ))}
                    <OutlinedBrownButton sx={{ width: '160px' }} onClick={addVariant} className="!mb-4">Add Variant</OutlinedBrownButton>
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
                        <div className="mb-6">
                            <img src={imagePreview} alt="Preview" className="max-w-full h-auto mx-auto rounded-md" />
                        </div>
                    )}
                    <BrownButton
                        onClick={handleAddProduct}
                        variant="contained"
                        color="primary"
                        className="w-full"
                    >
                        Add
                    </BrownButton>
                </Box>
            </div>
        </Modal>
    );
};

export default AddProductModal;
