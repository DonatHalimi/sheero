import UploadIcon from '@mui/icons-material/Upload';
import { Box, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';
import { BrownButton, BrownOutlinedTextField, OutlinedBrownButton, OutlinedBrownFormControl, VisuallyHiddenInput } from '../../Dashboard/CustomComponents';

const EditProductModal = ({ open, onClose, product, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [inventoryCount, setInventoryCount] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
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
        if (product) {
            setName(product.name);
            setDescription(product.description);
            setPrice(product.price);
            setSalePrice(product.salePrice || '');
            setCategory(product.category._id);
            setSubcategory(product.subcategory._id);
            setInventoryCount(product.inventoryCount);
            if (product.image) {
                setImagePreview(`http://localhost:5000/${product.image}`);
            } else {
                setImagePreview('');
            }
            if (product.dimensions) {
                setLength(product.dimensions.length);
                setWidth(product.dimensions.width);
                setHeight(product.dimensions.height);
                setUnit(product.dimensions.unit || 'cm');
            }
            if (product.variants) {
                setVariants(product.variants);
            }
        }

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
    }, [product]);

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

    const handleEditProduct = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('salePrice', salePrice);
        formData.append('category', category);
        formData.append('subcategory', subcategory);
        formData.append('inventoryCount', inventoryCount);
        formData.append('dimensions[length]', length);
        formData.append('dimensions[width]', width);
        formData.append('dimensions[height]', height);
        formData.append('dimensions[unit]', unit);
        variants.forEach((variant, index) => {
            formData.append(`variants[${index}][color]`, variant.color);
            formData.append(`variants[${index}][size]`, variant.size);
        });
        if (image instanceof File) {
            formData.append('image', image);
        }

        try {
            await axiosInstance.put(`/products/update/${product._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Product updated successfully');
            onEditSuccess();
            onClose();
        } catch (error) {
            toast.error('Error updating product');
            console.error('Error updating product', error);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div className="flex items-center justify-center h-screen">
                <Box className="edit-modal bg-white p-4 rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
                    <Typography variant='h5' className="!text-xl !font-bold !mb-6">Edit Product</Typography>
                    <BrownOutlinedTextField
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        fullWidth
                        className="!mb-4"
                    />
                    <BrownOutlinedTextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        className="!mb-4"
                    />
                    <Box className="flex gap-4 mb-2">
                        <BrownOutlinedTextField
                            label="Price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            fullWidth
                            className="!mb-4"
                        />
                        <BrownOutlinedTextField
                            label="Sale Price"
                            value={salePrice}
                            onChange={(e) => setSalePrice(e.target.value)}
                            fullWidth
                            className="!mb-4"
                        />
                    </Box>
                    <BrownOutlinedTextField
                        label="Inventory Count"
                        value={inventoryCount}
                        onChange={(e) => setInventoryCount(e.target.value)}
                        fullWidth
                        className="!mb-4"
                    />
                    <Box className="flex gap-4 mb-4">
                        <OutlinedBrownFormControl fullWidth className="mb-4">
                            <InputLabel>Category</InputLabel>
                            <Select
                                label="Category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className='!mb-4'
                            >
                                {categories.map((cat) => (
                                    <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                                ))}
                            </Select>
                        </OutlinedBrownFormControl>
                        <OutlinedBrownFormControl fullWidth>
                            <InputLabel>Subcategory</InputLabel>
                            <Select
                                label="Subcategory"
                                value={subcategory}
                                onChange={(e) => setSubcategory(e.target.value)}
                                className='!mb-4'
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
                            label="Length"
                            value={length}
                            onChange={(e) => setLength(e.target.value)}
                            fullWidth
                            className="!mb-4"
                        />
                        <BrownOutlinedTextField
                            label="Width"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                            fullWidth
                            className="!mb-4"
                        />
                        <BrownOutlinedTextField
                            label="Height"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            fullWidth
                            className="!mb-4"
                        />
                        <BrownOutlinedTextField
                            label="Unit"
                            value={unit}
                            onChange={(e) => setUnit(e.target.value)}
                            fullWidth
                            className="!mb-4"
                        />
                    </Box>
                    <Typography variant='h6' className="!text-lg !font-bold !mb-2">Variants</Typography>
                    {variants.map((variant, index) => (
                        <Box key={index} className="flex gap-4 mb-2">
                            <BrownOutlinedTextField
                                label="Color"
                                value={variant.color}
                                onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                                fullWidth
                            />
                            <BrownOutlinedTextField
                                label="Size"
                                value={variant.size}
                                onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                                fullWidth
                            />
                            <OutlinedBrownButton
                                onClick={() => removeVariant(index)}
                                variant="outlined"
                                color="secondary"
                                className="!ml-2"
                            >
                                Remove
                            </OutlinedBrownButton>
                        </Box>
                    ))}
                    <OutlinedBrownButton
                        sx={{
                            width: '152px'
                        }}
                        onClick={addVariant}
                        variant="outlined"
                        color="primary"
                        className="!mb-4"
                    >
                        Add Variant
                    </OutlinedBrownButton>
                    <Typography variant='h6' className="!text-lg !font-bold !mb-2">Image</Typography>
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
                        onClick={handleEditProduct}
                        fullWidth
                    >
                        Save Changes
                    </BrownButton>
                </Box>
            </div>
        </Modal>
    );
};

export default EditProductModal;
