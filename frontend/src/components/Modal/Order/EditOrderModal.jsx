import { Box, Chip, MenuItem, Typography, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ActionButtons, BoxBetween, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, DateAdornment, DeliveryStatusAdornment, EuroAdornment, formatDate, handleApiError, IdAdornment, PaymentMethodAdornment, PersonAdornment, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { chipSx } from '../../../assets/sx';
import { editOrderService } from '../../../services/orderService';
import { getImageUrl } from '../../../utils/config';

const EditOrderModal = ({ open, onClose, order, onViewDetails, onEditSuccess }) => {
    const [newStatus, setNewStatus] = useState(order?.status || '');
    const [loading, setLoading] = useState(false);
    const theme = useTheme();

    const user = `${order?.user?.firstName} ${order?.user?.lastName} - ${order?.user?.email}`;
    const productLabel = order?.products?.length > 1 ? 'Products' : 'Product';
    const arrivalDateRange = order?.arrivalDateRange ? formatDate(order.arrivalDateRange.start) + ' - ' + formatDate(order.arrivalDateRange.end) : '';

    useEffect(() => {
        if (order) {
            setNewStatus(order.status);
        }
    }, [order]);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success('Order ID copied to clipboard!');
        });
    };

    const handleEditOrder = async () => {
        setLoading(true);
        if (!newStatus) {
            toast.error('Please select a status');
            return;
        }

        const updateData = {
            orderId: order._id,
            status: newStatus
        };

        if (order.paymentMethod === 'cash') {
            if (newStatus === 'delivered') {
                updateData.paymentStatus = 'completed';
            } else if (newStatus === 'canceled') {
                updateData.paymentStatus = 'failed';
            } else if (['pending', 'processed', 'shipped'].includes(newStatus)) {
                updateData.paymentStatus = 'pending';
            }
        }

        try {
            const response = await editOrderService(updateData);

            toast.success(response.data.message, {
                onClick: () => copyToClipboard(order._id),
                autoClose: 6000
            });

            onEditSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error updating order status');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit Order Status</CustomTypography>

                <ReadOnlyTextField
                    label="Order ID"
                    value={order?._id}
                    fullWidth
                    InputProps={IdAdornment()}
                    className="!mb-4"
                />

                <ReadOnlyTextField
                    label="User"
                    value={user}
                    fullWidth
                    InputProps={PersonAdornment()}
                    className="!mb-2"
                />

                <Box className="!mb-4">
                    <Typography variant="body2" style={{ color: theme.palette.text.primary }}>
                        {productLabel} + (Quantity)
                    </Typography>
                    {order?.products && order?.products.length > 0 ? (
                        order?.products.map((item, index) => (
                            <Box key={index} sx={chipSx}>
                                <Chip
                                    label={
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Box
                                                onClick={() => window.open(`/product/${item.product?._id}`, '_blank')}
                                                display="flex"
                                                alignItems="center"
                                                gap={1}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <img
                                                    src={getImageUrl(item.product?.image)}
                                                    alt={item.product?.name}
                                                    className="w-10 h-10 object-contain"
                                                />
                                                <Typography variant="body2" className="!font-semibold hover:underline">
                                                    {`${item.product?.name} (${item.quantity})`}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    }
                                    variant="outlined"
                                    className="w-full !justify-start"
                                />
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body2" component="li">
                            No products found
                        </Typography>
                    )}
                </Box>

                <BoxBetween>
                    <ReadOnlyTextField
                        label="Total Amount"
                        value={order?.totalAmount.toFixed(2)}
                        InputProps={EuroAdornment()}
                        className="!mb-4"
                    />

                    <ReadOnlyTextField
                        label="Payment Method"
                        value={order?.paymentMethod}
                        InputProps={PaymentMethodAdornment(order?.paymentMethod)}
                        className="!mb-4"
                    />
                </BoxBetween>

                {order?.paymentMethod === 'stripe' && (
                    <ReadOnlyTextField
                        label="Payment Intent Id"
                        value={order?.paymentIntentId}
                        multiline
                        rows={2}
                        InputProps={IdAdornment()}
                        className="!mb-4"
                    />
                )}

                <ReadOnlyTextField
                    label="Arrival Date Range"
                    value={arrivalDateRange}
                    InputProps={DateAdornment()}
                    className="!mb-4"
                />

                <BrownOutlinedTextField
                    select
                    fullWidth
                    label="Order Status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    InputProps={DeliveryStatusAdornment(newStatus)}
                    className="!mb-4"
                >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="processed">Processed</MenuItem>
                    <MenuItem value="shipped">Shipped</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                    <MenuItem value="canceled">Canceled</MenuItem>
                </BrownOutlinedTextField>

                <ActionButtons
                    primaryButtonLabel="Save"
                    secondaryButtonLabel="View Details"
                    onPrimaryClick={handleEditOrder}
                    onSecondaryClick={() => {
                        onViewDetails(order);
                        onClose();
                    }}
                    primaryButtonProps={{
                        disabled: loading
                    }}
                    loading={loading}
                />
            </CustomBox>
        </CustomModal>
    );
};

export default EditOrderModal;