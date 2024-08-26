import UploadIcon from '@mui/icons-material/Upload';
import { Box, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, OutlinedBrownButton, OutlinedBrownFormControl, VisuallyHiddenInput } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';

const EditProductModal = ({ open, onClose, product, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [category, setCategory] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [subSubcategory, setSubSubcategory] = useState('');
    const [inventoryCount, setInventoryCount] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [subSubcategories, setSubSubcategories] = useState([]);
    const [length, setLength] = useState('');
    const [width, setWidth] = useState('');
    const [height, setHeight] = useState('');
    const [unit, setUnit] = useState('cm');
    const [variants, setVariants] = useState([{ color: '', size: '' }]);
    const [discountType, setDiscountType] = useState('percentage');
    const [discountValue, setDiscountValue] = useState(0);
    const [supplier, setSupplier] = useState('');
    const [suppliers, setSuppliers] = useState([]);
    const [weight, setWeight] = useState('');
    const [shippingCost, setShippingCost] = useState('');
    const [packageSize, setPackageSize] = useState('medium');
    const [details, setDetails] = useState([{ attribute: '', value: '' }]);

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        if (product) {
            setName(product.name || '');
            setDescription(product.description || '');
            setPrice(product.price || '');
            setSalePrice(product.salePrice || '');
            setCategory(product.category?._id || '');
            setSubcategory(product.subcategory?._id || '');
            setSubSubcategory(product.subSubcategory?._id || '');
            setInventoryCount(product.inventoryCount || '');
            setSupplier(product.supplier?._id || '');
            setImagePreview(product.image ? `http://localhost:5000/${product.image}` : '');

            if (product.dimensions) {
                setLength(product.dimensions.length || '');
                setWidth(product.dimensions.width || '');
                setHeight(product.dimensions.height || '');
                setUnit(product.dimensions.unit || 'cm');
            }

            if (product.variants) {
                setVariants(product.variants);
            }

            if (product.discount) {
                setDiscountType(product.discount.type || 'percentage');
                setDiscountValue(product.discount.value || 0);
            }

            if (product.shipping) {
                setWeight(product.shipping.weight || '');
                setShippingCost(product.shipping.cost || '');
                setPackageSize(product.shipping.packageSize || 'medium');
            }

            if (product.details) {
                setDetails(product.details);
            }
        }
    }, [product]);

    useEffect(() => {
        const TIMEOUT = 5000;

        async function fetchCategoriesAndSubcategories() {
            try {
                const response = await axiosInstance.get('/categories/get', { timeout: TIMEOUT });
                setCategories(response.data);

                const subcategoriesResponse = await axiosInstance.get('/subcategories/get', { timeout: TIMEOUT });
                setSubcategories(subcategoriesResponse.data);

                const subSubcategoriesResponse = await axiosInstance.get('/subsubcategories/get', { timeout: TIMEOUT });
                setSubSubcategories(subSubcategoriesResponse.data);
            } catch (error) {
                if (error.code === 'ECONNABORTED') {
                    console.error('Request timed out');
                } else {
                    console.error('Error fetching categories, subcategories, and subsubcategories:', error.message);
                }
            }
        }

        async function fetchSuppliers() {
            try {
                const response = await axiosInstance.get('/suppliers/get', { timeout: TIMEOUT });
                setSuppliers(response.data);
            } catch (error) {
                if (error.code === 'ECONNABORTED') {
                    console.error('Request timed out');
                } else {
                    console.error('Error fetching suppliers:', error.message);
                }
            }
        }

        fetchCategoriesAndSubcategories();
        fetchSuppliers();
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

    const handleDetailChange = (index, key, value) => {
        const newDetails = [...details];
        newDetails[index][key] = value;
        setDetails(newDetails);
    };

    const addDetail = () => {
        setDetails([...details, { attribute: '', value: '' }]);
    };

    const removeDetail = (index) => {
        setDetails(details.filter((_, i) => i !== index));
    };

    useEffect(() => {
        if (price && salePrice) {
            const priceValue = parseFloat(price);
            const salePriceValue = parseFloat(salePrice);

            if (salePriceValue < priceValue) {
                const discountPercentage = Math.round(((priceValue - salePriceValue) / priceValue) * 100);
                setDiscountType('percentage');
                setDiscountValue(discountPercentage);
            } else {
                setDiscountValue(0);
            }
        }
    }, [price, salePrice]);

    const handleEditProduct = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('salePrice', salePrice);
        formData.append('category', category);
        formData.append('subcategory', subcategory);
        formData.append('subSubcategory', subSubcategory);
        formData.append('inventoryCount', inventoryCount);
        formData.append('dimensions[length]', length);
        formData.append('dimensions[width]', width);
        formData.append('dimensions[height]', height);
        formData.append('dimensions[unit]', unit);
        formData.append('discount[type]', discountType);
        formData.append('discount[value]', discountValue);
        formData.append('supplier', supplier);
        formData.append('shipping[weight]', weight);
        formData.append('shipping[cost]', shippingCost);
        formData.append('shipping[dimensions][length]', length);
        formData.append('shipping[dimensions][width]', width);
        formData.append('shipping[dimensions][height]', height);
        formData.append('shipping[dimensions][unit]', unit);
        formData.append('shipping[packageSize]', packageSize);
        variants.forEach((variant, index) => {
            formData.append(`variants[${index}][color]`, variant.color);
            formData.append(`variants[${index}][size]`, variant.size);
        });
        details.forEach((detail, index) => {
            formData.append(`details[${index}][attribute]`, detail.attribute);
            formData.append(`details[${index}][value]`, detail.value);
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
                        multiline
                        rows={4}
                        className="!mb-4"
                    />
                    <Box className="flex gap-4 mb-2">
                        <BrownOutlinedTextField
                            fullWidth
                            required
                            label="Price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="!mb-4"
                        />
                        <BrownOutlinedTextField
                            fullWidth
                            label="Sale Price"
                            type="number"
                            value={salePrice}
                            onChange={(e) => setSalePrice(e.target.value)}
                            className="!mb-4"
                        />
                    </Box>
                    <BrownOutlinedTextField
                        fullWidth
                        required
                        label="Inventory Count"
                        type="number"
                        value={inventoryCount}
                        onChange={(e) => setInventoryCount(e.target.value)}
                        className="!mb-4"
                    />
                    <Box className="flex gap-4 mb-4">
                        <OutlinedBrownFormControl className="flex-1">
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                label='Category'
                            >
                                {categories.map((cat) => (
                                    <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
                                ))}
                            </Select>
                        </OutlinedBrownFormControl>
                        <OutlinedBrownFormControl className="flex-1">
                            <InputLabel>Subcategory</InputLabel>
                            <Select
                                value={subcategory}
                                onChange={(e) => setSubcategory(e.target.value)}
                                label='Subcategory'
                            >
                                {subcategories.map((subcat) => (
                                    <MenuItem key={subcat._id} value={subcat._id}>{subcat.name}</MenuItem>
                                ))}
                            </Select>
                        </OutlinedBrownFormControl>
                        <OutlinedBrownFormControl className="flex-1">
                            <InputLabel>SubSubcategory</InputLabel>
                            <Select
                                value={subSubcategory}
                                onChange={(e) => setSubSubcategory(e.target.value)}
                                label='SubSubcategory'
                            >
                                {subSubcategories.map((subsubcat) => (
                                    <MenuItem key={subsubcat._id} value={subsubcat._id}>{subsubcat.name}</MenuItem>
                                ))}
                            </Select>
                        </OutlinedBrownFormControl>
                    </Box>
                    <Typography variant='h6' className="!text-lg !font-bold !mb-2">Dimensions</Typography>
                    <Box className="flex gap-4 mb-4">
                        <BrownOutlinedTextField
                            fullWidth
                            label="Length"
                            type="number"
                            value={length}
                            onChange={(e) => setLength(e.target.value)}
                            className="!mb-4"
                        />
                        <BrownOutlinedTextField
                            fullWidth
                            label="Width"
                            type="number"
                            value={width}
                            onChange={(e) => setWidth(e.target.value)}
                            className="!mb-4"
                        />
                        <BrownOutlinedTextField
                            fullWidth
                            label="Height"
                            type="number"
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

                    <Typography variant='h6' className="!text-lg !font-bold !mb-2">Details</Typography>
                    {details.map((detail, index) => (
                        <Box key={index} className="flex gap-4 mb-2">
                            <BrownOutlinedTextField
                                fullWidth
                                label="Attribute"
                                value={detail.attribute}
                                onChange={(e) => handleDetailChange(index, 'attribute', e.target.value)}
                            />
                            <BrownOutlinedTextField
                                fullWidth
                                label="Value"
                                value={detail.value}
                                onChange={(e) => handleDetailChange(index, 'value', e.target.value)}
                            />
                            <OutlinedBrownButton onClick={() => removeDetail(index)}>Remove</OutlinedBrownButton>
                        </Box>
                    ))}
                    <OutlinedBrownButton sx={{ width: '160px' }} onClick={addDetail} className="!mb-4">Add Detail</OutlinedBrownButton>

                    <OutlinedBrownFormControl fullWidth className="!mb-4">
                        <InputLabel>Supplier</InputLabel>
                        <Select
                            value={supplier}
                            onChange={(e) => setSupplier(e.target.value)}
                            label='Supplier'
                        >
                            {suppliers.map((sup) => (
                                <MenuItem key={sup._id} value={sup._id}>{sup.name}</MenuItem>
                            ))}
                        </Select>
                    </OutlinedBrownFormControl>

                    <Typography variant='h6' className="!text-lg !font-bold !mb-2">Shipping</Typography>
                    <Box className="flex gap-4 mb-4">
                        <BrownOutlinedTextField
                            fullWidth
                            label="Weight"
                            type="number"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="!mb-4"
                        />
                        <BrownOutlinedTextField
                            fullWidth
                            label="Shipping Cost"
                            type="number"
                            value={shippingCost}
                            onChange={(e) => setShippingCost(e.target.value)}
                            className="!mb-4"
                        />
                    </Box>
                    <OutlinedBrownFormControl fullWidth className="!mb-4">
                        <InputLabel>Package Size</InputLabel>
                        <Select
                            value={packageSize}
                            onChange={(e) => setPackageSize(e.target.value)}
                            label='Package Size'
                        >
                            <MenuItem value="small">Small</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="large">Large</MenuItem>
                        </Select>
                    </OutlinedBrownFormControl>

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
                        variant="contained"
                        color="primary"
                        className="w-full"
                    >
                        Save Changes
                    </BrownButton>
                </Box>
            </div>
        </Modal>
    );
};

export default EditProductModal;