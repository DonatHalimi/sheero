import { Autocomplete, Box, InputLabel, MenuItem, Modal, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomPaper, CustomTypography, ImageUploadBox, OutlinedBrownButton, OutlinedBrownFormControl } from '../../../../assets/CustomComponents';
import axiosInstance from '../../../../utils/axiosInstance';

const AddProductModal = ({ open, onClose, onAddSuccess }) => {
    const [step, setStep] = useState(1);
    const [productId, setProductId] = useState(null);
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

    const navigate = useNavigate();

    const [debounceTimeout, setDebounceTimeout] = useState(null);

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

        if (debounceTimeout) clearTimeout(debounceTimeout);

        setDebounceTimeout(setTimeout(fetchData, 1500));

        return () => {
            clearTimeout(debounceTimeout);
        };
    }, []);

    const handleFileSelect = (file) => {
        setImage(file);
    };

    const handleBasicProductCreation = async () => {
        if (!name || !description || !price || !category || !subcategory || !subSubcategory || !inventoryCount) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const response = await axiosInstance.post('/products/create-basic', {
                name,
                description,
                price,
                salePrice,
                category: category._id,
                subcategory: subcategory._id,
                subSubcategory: subSubcategory._id,
                inventoryCount,
                supplier: supplier ? supplier._id : null
            });
            setProductId(response.data.productId);
            setStep(2);
            toast.success('Basic product information saved');
        } catch (error) {
            console.error('Error creating basic product:', error);
            toast.error('Error creating basic product');
        }
    };

    const handleImageUpload = async () => {
        if (!image) {
            toast.error('Please select an image');
            return;
        }

        const formData = new FormData();
        formData.append('image', image);
        formData.append('productId', productId);

        try {
            await axiosInstance.post('/products/upload-image', formData);
            setStep(3);
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Error uploading image');
        }
    };

    const handleVariantsAndDetailsAddition = async () => {
        try {
            await axiosInstance.post('/products/add-variants', {
                productId,
                variants,
                dimensions: { length, width, height, unit },
                discount: { type: discountType, value: discountValue },
                supplier: supplier ? supplier._id : null,
                shipping: { weight, cost: shippingCost, packageSize },
                details
            });
            toast.success('Product details added successfully');
            onAddSuccess();
            setStep(1);
            onClose();
        } catch (error) {
            console.error('Error adding product details:', error);
            toast.error('Error adding product details');
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

    const resetForm = () => {
        setStep(1);
        setName('');
        setDescription('');
        setPrice('');
        setSalePrice('');
        setCategory(null);
        setSubcategory(null);
        setSubSubcategory(null);
        setInventoryCount('');
        setImage(null);
        setImagePreview(null);
        setLength('');
        setWidth('');
        setHeight('');
        setUnit('cm');
        setVariants([{ color: '', size: '' }]);
        setDiscountType('percentage');
        setDiscountValue(0);
        setSupplier(null);
        setWeight('');
        setShippingCost('');
        setPackageSize('medium');
        setDetails([{ attribute: '', value: '' }]);
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <>
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
                        <BrownButton
                            onClick={handleBasicProductCreation}
                            variant="contained"
                            color="primary"
                            className="w-full"
                        >
                            Next: Upload Image
                        </BrownButton>
                    </>
                );
            case 2:
                return (
                    <>
                        <ImageUploadBox onFileSelect={handleFileSelect} />
                        <BrownButton
                            onClick={handleImageUpload}
                            variant="contained"
                            color="primary"
                            className="w-full"
                        >
                            Next: Add Details
                        </BrownButton>
                    </>
                );
            case 3:
                return (
                    <>
                        <CustomTypography variant='h6' className="!text-lg !font-bold !mb-2">Dimensions</CustomTypography>
                        <Box className="flex gap-4 mb-2">
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
                        <CustomTypography variant='h6' className="!text-lg !font-bold !mb-2">Variants</CustomTypography>
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
                        <OutlinedBrownButton onClick={addVariant} className="mb-4">Add Variant</OutlinedBrownButton>
                        <CustomTypography variant='h6' className="!text-lg !font-bold !mb-2">Additional Details</CustomTypography>
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
                        <OutlinedBrownButton onClick={addDetail} className="!mb-4">Add Detail</OutlinedBrownButton>
                        <CustomTypography variant='h6' className="!text-lg !font-bold !mb-2">Shipping</CustomTypography>
                        <Box className="flex gap-4 mb-2">
                            <BrownOutlinedTextField
                                fullWidth
                                label="Weight"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="!mb-4"
                            />
                            <BrownOutlinedTextField
                                fullWidth
                                label="Shipping Cost"
                                value={shippingCost}
                                onChange={(e) => setShippingCost(e.target.value)}
                                className="!mb-4"
                            />
                        </Box>
                        <OutlinedBrownFormControl fullWidth className="!mb-4">
                            <InputLabel id="package-size-label">Package Size</InputLabel>
                            <Select
                                labelId="package-size-label"
                                value={packageSize}
                                onChange={(e) => setPackageSize(e.target.value)}
                                label="Package Size"
                            >
                                <MenuItem value="small">Small</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="large">Large</MenuItem>
                            </Select>
                        </OutlinedBrownFormControl>
                        <BrownButton
                            onClick={handleVariantsAndDetailsAddition}
                            variant="contained"
                            color="primary"
                            className="w-full"
                        >
                            Finish and Add Product
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
                <CustomBox className="edit-modal bg-white p-4 rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
                    <div className='flex justify-between mb-3'>
                        <CustomTypography variant='h5' className="!text-xl !font-bold !mb-4">Add Product</CustomTypography>
                        <OutlinedBrownButton onClick={resetForm}>Reset Form</OutlinedBrownButton>
                    </div>
                    {renderStep()}
                </CustomBox>
            </div>
        </Modal>
    );
};

export default AddProductModal;