import { Box, Chip, Drawer, Typography, useTheme } from '@mui/material';
import React from 'react';
import { BoxBetween, CloseButton, DateAdornment, DeliveryStatusAdornment, DrawerTypography, EditExportButtons, EuroAdornment, formatDate, IdAdornment, PaymentMethodAdornment, PaymentStatusAdornment, PersonAdornment, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { downloadOrderData } from '../../../assets/DataExport';
import { chipSx, drawerPaperSx } from '../../../assets/sx';
import { getImageUrl } from '../../../utils/config';

const OrderDetailsDrawer = ({ open, onClose, order, onEdit }) => {
    const theme = useTheme();

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
                        <Typography dangerouslySetInnerHTML={{ __html: header }} className='!text-lg' />

                        <ReadOnlyTextField
                            label="Order ID"
                            value={order._id}
                            InputProps={IdAdornment()}
                        />

                        <ReadOnlyTextField
                            label="User"
                            value={user}
                            InputProps={PersonAdornment()}
                        />

                        <Box>
                            <DrawerTypography theme={theme}>
                                {productLabel} + (Quantity)
                            </DrawerTypography>
                            {order?.products && order?.products.length > 0 ? (
                                order?.products.map((item, index) => (
                                    <Box key={index} sx={chipSx}>
                                        <Chip
                                            label={
                                                <Box display="flex" alignItems="center" gap={1}>
                                                    <Box
                                                        onClick={() => window.open(`/${item.product.slug}`, '_blank')}
                                                        display="flex"
                                                        alignItems="center"
                                                        gap={1}
                                                        sx={{ cursor: 'pointer' }}
                                                    >
                                                        <img
                                                            src={getImageUrl(item.product?.image)}
                                                            alt={item.product.name}
                                                            className="w-10 h-10 object-contain"
                                                        />
                                                        <Typography variant="body2" className="!font-semibold hover:underline" style={{ color: theme.palette.text.primary }}>
                                                            {`${item.product.name} (${item.quantity})`}
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
                                <Typography variant="body2" component="li" style={{ color: theme.palette.text.primary }}>
                                    No products found
                                </Typography>
                            )}
                        </Box>

                        <ReadOnlyTextField
                            label="Total Amount"
                            value={order.totalAmount.toFixed(2)}
                            InputProps={EuroAdornment()}
                        />

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Payment Method"
                                value={order.paymentMethod}
                                InputProps={PaymentMethodAdornment(order.paymentMethod)}
                            />

                            <ReadOnlyTextField
                                label="Payment Status"
                                value={order.paymentStatus}
                                InputProps={PaymentStatusAdornment(order.paymentStatus)}
                            />
                        </BoxBetween>

                        <ReadOnlyTextField
                            label="Delivery Status"
                            value={order.status}
                            InputProps={DeliveryStatusAdornment(order.status)}
                        />

                        <BoxBetween>
                            <ReadOnlyTextField
                                label="Arrival Date Start"
                                value={formatDate(order.arrivalDateRange?.start)}
                                InputProps={DateAdornment()}
                            />

                            <ReadOnlyTextField
                                label="Arrival Date End"
                                value={formatDate(order.arrivalDateRange?.end)}
                                InputProps={DateAdornment()}
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

                        {order.updatedBy && (
                            <ReadOnlyTextField
                                label="Updated By"
                                value={`${order.updatedBy.firstName} ${order.updatedBy.lastName} - ${order.updatedBy.email}`}
                                InputProps={PersonAdornment()}
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