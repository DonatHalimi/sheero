import { ArrowBack } from '@mui/icons-material';
import { Autocomplete, Box, MenuItem, Modal, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomPaper, ImageUploadBox, OutlinedBrownButton, OutlinedBrownFormControl } from '../../../assets/CustomComponents';
import axiosInstance from '../../../utils/axiosInstance';
import { getImageUrl } from '../../../utils/config';

const EditProductModal = ({ open, onClose, product, onEditSuccess }) => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [salePrice, setSalePrice] = useState('');
    const [category, setCategory] = useState(null);
    const [subcategory, setSubcategory] = useState(null);
    const [subSubcategory, setSubSubcategory] = useState(null);
    const [inventoryCount, setInventoryCount] = useState('');
    const [image, setImage] = useState(null);
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
    const [supplier, setSupplier] = useState(null);
    const [suppliers, setSuppliers] = useState([]);
    const [weight, setWeight] = useState('');
    const [shippingCost, setShippingCost] = useState('');
    const [packageSize, setPackageSize] = useState('medium');
    const [details, setDetails] = useState([{ attribute: '', value: '' }]);

    useEffect(() => {
        if (product) {
            setName(product.name || '');
            setDescription(product.description || '');
            setPrice(product.price || '');
            setSalePrice(product.salePrice ? parseInt(product.salePrice, 10) : '');
            updateDiscountValue(product.price, product.salePrice);
            setCategory(product.category || null);
            setSubcategory(product.subcategory || null);
            setSubSubcategory(product.subSubcategory || null);
            setInventoryCount(product.inventoryCount || '');
            setSupplier(product.supplier || null);
            setImage(null);

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
            } else {
                updateDiscountValue();
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
        const fetchData = async () => {
            try {
                const [categoriesResponse, subcategoriesResponse, subSubcategoriesResponse, suppliersResponse] = await Promise.all([
                    axiosInstance.get('/categories/get'),
                    axiosInstance.get('/subcategories/get'),
                    axiosInstance.get('/subsubcategories/get'),
                    axiosInstance.get('/suppliers/get')
                ]);

                setCategories(categoriesResponse.data.map(category => ({
                    ...category,
                    firstLetter: category.name[0].toUpperCase()
                })));
                setSubcategories(subcategoriesResponse.data.map(subcategory => ({
                    ...subcategory,
                    firstLetter: subcategory.name[0].toUpperCase()
                })));
                setSubSubcategories(subSubcategoriesResponse.data.map(subSubcategory => ({
                    ...subSubcategory,
                    firstLetter: subSubcategory.name[0].toUpperCase()
                })));
                setSuppliers(suppliersResponse.data.map(supplier => ({
                    ...supplier,
                    firstLetter: supplier.name[0].toUpperCase()
                })));
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Error fetching necessary data');
            }
        };

        fetchData();
    }, []);

    const handleFileSelect = (file) => {
        setImage(file);
    };

    const handleEditProduct = async () => {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('salePrice', salePrice);
        formData.append('category', category._id || category);
        formData.append('subcategory', subcategory._id || subcategory);
        formData.append('subSubcategory', subSubcategory._id || subSubcategory);
        formData.append('inventoryCount', inventoryCount);
        formData.append('dimensions[length]', length);
        formData.append('dimensions[width]', width);
        formData.append('dimensions[height]', height);
        formData.append('dimensions[unit]', unit);
        formData.append('discount[type]', discountType);
        formData.append('discount[value]', discountValue);
        formData.append('supplier', supplier._id || supplier);
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
            await axiosInstance.put(`/products/update/${product._id}`, formData);
            toast.success('Product updated successfully');
            onEditSuccess();
            setStep(1);
            onClose();
        } catch (error) {
            toast.error('Error updating product');
            console.error('Error updating product', error);
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

    const updateDiscountValue = (currentPrice, currentSalePrice) => {
        const priceValue = parseFloat(currentPrice);
        const salePriceValue = parseFloat(currentSalePrice);

        if (priceValue && salePriceValue && salePriceValue < priceValue) {
            const discountValue = ((priceValue - salePriceValue) / priceValue) * 100;
            setDiscountValue(Math.floor(discountValue));
        } else {
            setDiscountValue(0);
        }
    };

    const handleSalePriceChange = (e) => {
        const newSalePrice = e.target.value === '' ? '' : parseInt(e.target.value, 10);
        setSalePrice(newSalePrice);
        updateDiscountValue(price, newSalePrice);
    };

    const handleBackToStep1 = () => {
        setStep(1);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
                        {/* Step 1: Basic Product Information */}
                        <Typography variant='h5' className="!text-xl !font-bold !mb-4">Edit Basic Information</Typography>
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
                            multiline
                            rows={4}
                            onChange={(e) => setDescription(e.target.value)}
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
                                onChange={handleSalePriceChange}
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
                        {/* Category, Subcategory, SubSubcategory Autocomplete */}
                        <Box className="flex gap-4 mb-2">
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
                            <Autocomplete
                                id="subcategory-autocomplete"
                                options={subcategories.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                                groupBy={(option) => option.firstLetter}
                                getOptionLabel={(option) => option.name}
                                value={subcategory}
                                onChange={(event, newValue) => setSubcategory(newValue)}
                                PaperComponent={CustomPaper}
                                fullWidth
                                renderInput={(params) => <TextField {...params} label="Subcategory" variant="outlined" />}
                                className='!mb-4'
                            />
                        </Box>
                        <Box className="flex gap-4 mb-2">
                            <Autocomplete
                                id="subsubcategory-autocomplete"
                                options={subSubcategories.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                                groupBy={(option) => option.firstLetter}
                                getOptionLabel={(option) => option.name}
                                value={subSubcategory}
                                onChange={(event, newValue) => setSubSubcategory(newValue)}
                                PaperComponent={CustomPaper}
                                fullWidth
                                renderInput={(params) => <TextField {...params} label="Sub-Subcategory" variant="outlined" />}
                                className='!mb-4'
                            />
                            <Autocomplete
                                id="supplier-autocomplete"
                                options={suppliers.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                                groupBy={(option) => option.firstLetter}
                                getOptionLabel={(option) => option.name}
                                value={supplier}
                                onChange={(event, newValue) => setSupplier(newValue)}
                                PaperComponent={CustomPaper}
                                fullWidth
                                renderInput={(params) => <TextField {...params} label="Supplier" variant="outlined" />}
                                className='!mb-4'
                            />
                        </Box>
                        <BrownButton onClick={() => setStep(2)} variant="contained" color="primary" className="w-full">
                            Next: Upload Image
                        </BrownButton>
                    </>
                );
            case 2:
                return (
                    <>
                        {/* Step 2: Upload Image */}
                        <div className="flex items-center justify-between mb-4">
                            <Typography variant='h5' className="!text-xl !font-bold">Update Product Image</Typography>
                            <OutlinedBrownButton
                                onClick={handleBackToStep1}
                                startIcon={<ArrowBack />}
                            >
                                Back to Basic Info
                            </OutlinedBrownButton>
                        </div>

                        <ImageUploadBox onFileSelect={handleFileSelect} initialPreview={product?.image ? getImageUrl(product.image) : ''} />

                        <BrownButton onClick={() => setStep(3)} variant="contained" color="primary" className="w-full">
                            Next: Edit Variants, Dimensions, and Shipping
                        </BrownButton>
                    </>
                );
            case 3:
                return (
                    <>
                        {/* Step 3: Variants, Dimensions, and Shipping */}
                        <Typography variant='h5' className="!text-xl !font-bold !mb-4">Edit Dimensions, Variants, Details and Shipping</Typography>

                        {/* Button to return to Step 1 */}
                        <OutlinedBrownButton
                            onClick={handleBackToStep1}
                            startIcon={<ArrowBack />}
                            className="!mb-4"
                        >
                            Back to Basic Info
                        </OutlinedBrownButton>

                        <Typography variant='h6' className="!text-lg !font-bold !mb-4">Dimensions</Typography>
                        <Box className="flex gap-4 mb-2">
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
                        <Typography variant='h6' className="!text-lg !font-bold !mb-4">Variants</Typography>
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
                        <OutlinedBrownButton onClick={addVariant} className="!mb-4">Add Variant</OutlinedBrownButton>

                        {/* Details Section */}
                        <Typography variant='h6' className="!text-lg !font-bold !mb-4">Details</Typography>
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
                                <OutlinedBrownButton onClick={() => removeDetail(index)}>
                                    Remove
                                </OutlinedBrownButton>
                            </Box>
                        ))}
                        <OutlinedBrownButton onClick={addDetail} className="!mb-4">
                            Add Detail
                        </OutlinedBrownButton>

                        <Typography variant='h6' className="!text-lg !font-bold !mb-4">Shipping</Typography>
                        <Box className="flex gap-4 mb-2">
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
                            <TextField
                                label="Package Size"
                                value={packageSize}
                                onChange={(e) => setPackageSize(e.target.value)}
                                select
                            >
                                <MenuItem value="small">Small</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="large">Large</MenuItem>
                            </TextField>
                        </OutlinedBrownFormControl>
                        <BrownButton onClick={handleEditProduct} variant="contained" color="primary" className="w-full">
                            Save Changes
                        </BrownButton>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div className="flex items-center justify-center h-screen">
                <Box className="edit-modal bg-white p-4 rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
                    {renderStep()}
                </Box>
            </div>
        </Modal>
    );
};

export default EditProductModal;