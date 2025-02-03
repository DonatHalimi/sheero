import { Box, Chip, MenuItem, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ActionButtons, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, formatDate, handleApiError, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { productChipSx } from '../../../assets/sx';
import { editOrderService } from '../../../services/orderService';

const EditOrderModal = ({ open, onClose, order, onViewDetails, onEditSuccess }) => {
    const [newStatus, setNewStatus] = useState(order?.status || '');

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
        if (!newStatus) {
            toast.error('Please select a status', {
                closeOnClick: true
            });
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
            } else if (['pending', 'shipped'].includes(newStatus)) {
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
                    className="!mb-4"
                />

                <ReadOnlyTextField
                    label="User"
                    value={user}
                    fullWidth
                    className="!mb-4"
                />

                <Box>
                    <Typography variant="body1" className="!font-semibold !mb-2">
                        {productLabel} + (Quantity)
                    </Typography>
                    {order?.products && order?.products.length > 0 ? (
                        order?.products.map((item, index) => (
                            <Box
                                key={index}
                                sx={productChipSx}
                            >
                                <Chip
                                    label={`${item.product?.name} (${item.quantity})`}
                                    variant="outlined"
                                    className="!font-semibold w-full !justify-start"
                                />
                            </Box>
                        ))
                    ) : (
                        <Typography variant="body2" component="li">
                            No products found
                        </Typography>
                    )}
                </Box>

                <ReadOnlyTextField
                    label="Total Amount"
                    value={order?.totalAmount}
                    className="!mb-4 !mt-4"
                />

                <ReadOnlyTextField
                    label="Payment Method"
                    value={order?.paymentMethod}
                    className="!mb-4"
                />

                <ReadOnlyTextField
                    label="Arrival Date Range"
                    value={arrivalDateRange}
                    className="!mb-4"
                />

                <BrownOutlinedTextField
                    select
                    fullWidth
                    label="Order Status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="!mb-4"
                >
                    <MenuItem value="pending">Pending</MenuItem>
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
                />
            </CustomBox>
        </CustomModal>
    );
};

export default EditOrderModal;