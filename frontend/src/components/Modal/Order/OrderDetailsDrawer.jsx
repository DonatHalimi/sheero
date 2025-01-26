import { Box, Drawer, Typography } from '@mui/material';
import React from 'react';
import { BoxBetween, CloseButton, downloadOrderData, EditExportButtons, formatDate, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { drawerPaperSx } from '../../../assets/sx';

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
                            <Typography variant="body1" className="!font-bold">
                                {productLabel} + (Quantity)
                            </Typography>
                            <Box component="ul" sx={{ pl: 2, mt: 1 }} className="list-disc">
                                {order?.products && order?.products.length > 0 ? (
                                    order?.products.map((item, index) => (
                                        <Typography
                                            key={index}
                                            variant="body2"
                                            component="li"
                                            className='!mb-1'
                                        >
                                            {item.product?.name} <span className="!font-bold">({item.quantity})</span>
                                        </Typography>
                                    ))
                                ) : (
                                    <Typography variant="body2" component="li">
                                        No products found
                                    </Typography>
                                )}
                            </Box>
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