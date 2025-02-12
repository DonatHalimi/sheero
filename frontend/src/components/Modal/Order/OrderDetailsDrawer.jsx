import { Box, Chip, Drawer, Typography } from '@mui/material';
import React from 'react';
import { BoxBetween, CloseButton, EditExportButtons, formatDate, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { downloadOrderData } from '../../../assets/DataExport';
import { drawerPaperSx, productChipSx } from '../../../assets/sx';
import { getImageUrl } from '../../../utils/config';

const OrderDetailsDrawer = ({ open, onClose, order, onEdit }) => {
    const handleEditClick = () => {
        onClose();
        onEdit(order);
    };

    const productLabel = order?.products?.length > 1 ? 'Products' : 'Product';
    const header = `Order from  <strong>${order?.user.firstName} ${order?.user.lastName} - ${order?.user.email}</strong> for <strong>${order?.products.length} ${productLabel}</strong>`;
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
                        <Typography className='!text-lg' dangerouslySetInnerHTML={{ __html: header }} />

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
                                    <Box key={index} sx={productChipSx}>
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