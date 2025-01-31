import { Box, Chip, Drawer, Typography } from '@mui/material';
import React from 'react';
import { BoxBetween, CloseButton, EditExportButtons, formatDate, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { downloadOrderData } from '../../../assets/DataExport';
import { drawerPaperSx, productChipSx } from '../../../assets/sx';

const OrderDetailsDrawer = ({ open, onClose, order, onEdit }) => {
    const handleEditClick = () => {
        onClose();
        onEdit(order);
    };

    const productLabel = order?.products?.length > 1 ? 'Products' : 'Product';
    const header = `Order from ${order?.user.firstName} ${order?.user.lastName} - ${order?.user.email} for ${order?.products.length} ${productLabel}`;
    const user = `${order?.user.firstName} ${order?.user.lastName} - ${order?.user.email}`;

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
                {order ? (
                    <>
                        <Typography className='!font-bold !text-lg'>
                            {header}
                        </Typography>

                        <ReadOnlyTextField
                            label="Order ID"
                            value={order._id}
                        />

                        <ReadOnlyTextField
                            label="User"
                            value={user}
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
                            value={order.totalAmount}
                        />

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Payment Method"
                                value={order.paymentMethod}
                            />

                            <ReadOnlyTextField
                                label="Payment Status"
                                value={order.paymentStatus}
                            />
                        </BoxBetween>

                        <ReadOnlyTextField
                            label="Delivery Status"
                            value={order.status}
                        />
                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Arrival Date Start"
                                value={formatDate(order.arrivalDateRange?.start)}
                            />

                            <ReadOnlyTextField
                                label="Arrival Date End"
                                value={formatDate(order.arrivalDateRange?.end)}
                            />
                        </BoxBetween>

                        {order.paymentIntentId && (
                            <ReadOnlyTextField
                                label="Payment Intent Id"
                                value={order.paymentIntentId}
                                multiline
                                rows={2}
                            />
                        )}

                        <EditExportButtons
                            onEditClick={handleEditClick}
                            onExportClick={() => downloadOrderData(order)}
                        />
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching order" />
                )}
            </Box>
        </Drawer>
    );
};

export default OrderDetailsDrawer;