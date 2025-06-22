import { Box, Drawer } from '@mui/material';
import { drawerPaperSx } from '../../../../assets/sx';
import { getImageUrl } from '../../../../utils/config';
import { EuroAdornment, IdAdornment, InventoryAdornment, ShippingAdornment } from '../../../custom/Adornments';
import { DetailsTitle } from '../../../custom/Dashboard';
import { BoxBetween, CloseButton, ReadOnlyTextField } from '../../../custom/MUI';
import { formatDimensions, formatProductDetails, formatProductDiscount, formatProductShipping, formatProductVariants } from '../../../custom/utils';
import { downloadProductData } from '../../../Product/Utils/DataExport';

const ProductDetailsDrawer = ({ open, onClose, product, onEdit, onDelete }) => {
    const handleEdit = () => {
        onClose();
        onEdit(product);
    };

    const handleExport = () => {
        downloadProductData(product);
    };

    const handleDelete = () => {
        onClose();
        onDelete(product);
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={drawerPaperSx}
            sx={{ zIndex: 9999 }}
        >
            <CloseButton onClose={onClose} />
            <Box className="flex flex-col w-full mt-4 gap-4">
                {product ? (
                    <>
                        <DetailsTitle
                            entity={product}
                            entityName="Product"
                            handleEdit={handleEdit}
                            handleExport={handleExport}
                            handleDelete={handleDelete}
                        />

                        <ReadOnlyTextField
                            label="Product ID"
                            value={product._id}
                            InputProps={IdAdornment()}
                        />

                        <ReadOnlyTextField
                            label="Name"
                            value={product?.name}
                            multiline
                            rows={3}
                            onClick={() => window.open(`/${product.slug}`, '_blank')}
                            className='cursor-pointer hover:underline'
                        />

                        <Box className="flex flex-col items-center mt-3 mb-3">
                            <img
                                src={getImageUrl(product.image)}
                                alt={`${product.name} image`}
                                onClick={() => window.open(`/${product.slug}`, '_blank')}
                                className='w-1/3 cursor-pointer'
                            />
                        </Box>

                        <ReadOnlyTextField
                            label="Description"
                            value={product?.description}
                            multiline
                            rows={3}
                        />

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Price"
                                value={product?.price}
                                InputProps={EuroAdornment()}
                            />

                            <ReadOnlyTextField
                                label="Sale Price"
                                value={product?.salePrice}
                                InputProps={EuroAdornment()}
                            />

                            <ReadOnlyTextField
                                label="Discount"
                                value={formatProductDiscount(product.discount)}
                            />
                        </BoxBetween>

                        <ReadOnlyTextField
                            label="Shipping"
                            value={formatProductShipping(product.shipping)}
                            InputProps={ShippingAdornment()}
                        />

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Category"
                                value={product.category?.name || 'N/A'}
                            />

                            <ReadOnlyTextField
                                label="Subcategory"
                                value={product.subcategory?.name || 'N/A'}
                            />
                        </BoxBetween>

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="SubSubcategory"
                                value={product.subSubcategory?.name || 'N/A'}
                            />

                            <ReadOnlyTextField
                                label="Supplier"
                                value={product.supplier?.name || 'N/A'}
                            />
                        </BoxBetween>

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Inventory Count"
                                value={product.inventoryCount || 'N/A'}
                                InputProps={InventoryAdornment()}
                            />

                            <ReadOnlyTextField
                                label="Dimensions"
                                value={formatDimensions(product.dimensions)}
                            />

                            <ReadOnlyTextField
                                label="Variants"
                                value={formatProductVariants(product.variants)}
                            />
                        </BoxBetween>

                        <ReadOnlyTextField
                            label="Details"
                            value={formatProductDetails(product.details)}
                        />
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching product" />
                )}
            </Box>
        </Drawer>
    );
};

export default ProductDetailsDrawer;