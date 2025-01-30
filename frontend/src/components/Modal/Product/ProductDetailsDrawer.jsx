import { Box, Drawer, Typography } from '@mui/material';
import React from 'react';
import { BoxBetween, CloseButton, EditExportButtons, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { drawerPaperSx } from '../../../assets/sx';
import { getImageUrl } from '../../../utils/config';
import { downloadProductData } from '../../../assets/DataExport';

const ProductDetailsDrawer = ({ open, onClose, product, onEdit }) => {
    const handleEditClick = () => {
        onClose();
        onEdit(product);
    };

    const formatDimensions = (dimensions) => {
        if (!dimensions || !dimensions.length || !dimensions.width || !dimensions.height || !dimensions.unit) {
            return 'N/A';
        }
        return `${dimensions.length} x ${dimensions.width} x ${dimensions.height} ${dimensions.unit}`;
    };

    const formatShipping = (shipping) => {
        if (!shipping) return 'N/A';
        return `${shipping.weight} kg, ${shipping.cost}€, ${shipping.packageSize}`;
    };

    const formatDiscount = (discount) => {
        if (!discount) return 'N/A';
        return `${discount.value}${discount.type === 'percentage' ? '%' : ''}`;
    };

    const formatVariants = (variants) => {
        if (!variants || variants.length === 0) return 'N/A';
        return variants.map(variant => `Color: ${variant.color}, Size: ${variant.size}`).join(', ');
    };

    const formatDetails = (details) => {
        if (!details || details.length === 0) return 'N/A';
        return details.map(detail => `${detail.attribute}: ${detail.value}`).join(', ');
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
                        <Typography className='!font-bold !text-lg'>
                            {product.name}'s Details
                        </Typography>

                        <ReadOnlyTextField
                            label="Product ID"
                            value={product._id}
                        />

                        <ReadOnlyTextField
                            label="Name"
                            value={product.name || 'N/A'}
                            multiline
                            rows={3}
                        />

                        <Box className="flex flex-col items-center mt-3 mb-3">
                            <img
                                src={getImageUrl(product.image)}
                                alt={`${product.name} image`}
                                className='w-1/3'
                            />
                        </Box>

                        <ReadOnlyTextField
                            label="Description"
                            value={product.description || 'N/A'}
                            multiline
                            rows={3}
                        />

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Price"
                                value={product.price || 'N/A'}
                            />

                            <ReadOnlyTextField
                                label="Sale Price"
                                value={product.salePrice || 'N/A'}
                            />

                            <ReadOnlyTextField
                                label="Discount"
                                value={formatDiscount(product.discount)}
                            />
                        </BoxBetween>

                        <ReadOnlyTextField
                            label="Shipping"
                            value={formatShipping(product.shipping)}
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

                            <ReadOnlyTextField
                                label="SubSubcategory"
                                value={product.subSubcategory?.name || 'N/A'}
                            />
                        </BoxBetween>

                        <ReadOnlyTextField
                            label="Supplier"
                            value={product.supplier?.name || 'N/A'}
                        />

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Inventory Count"
                                value={product.inventoryCount || 'N/A'}
                            />

                            <ReadOnlyTextField
                                label="Dimensions"
                                value={formatDimensions(product.dimensions)}
                            />

                            <ReadOnlyTextField
                                label="Variants"
                                value={formatVariants(product.variants)}
                            />
                        </BoxBetween>

                        <ReadOnlyTextField
                            label="Details"
                            value={formatDetails(product.details)}
                        />

                        <EditExportButtons
                            onEditClick={handleEditClick}
                            onExportClick={() => downloadProductData(product)}
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