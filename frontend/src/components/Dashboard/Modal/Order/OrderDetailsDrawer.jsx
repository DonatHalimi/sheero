import { Box, Drawer, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { paperPropsSx } from '../../../../assets/sx';
import { CityAdornment, CommentAdornment, CountryAdornment, DateAdornment, DeliveryStatusAdornment, EuroAdornment, IdAdornment, PaymentMethodAdornment, PaymentStatusAdornment, PersonAdornment, PhoneAdornment, StreetAdornment } from '../../../custom/Adornments';
import { CollapsibleProductList, TitleActions } from '../../../custom/Dashboard';
import { BoxBetween, CloseButton, ReadOnlyTextField } from '../../../custom/MUI';
import { formatDate, formatDateTime } from '../../../custom/utils';
import { downloadOrderData } from '../../../Product/Utils/DataExport';

const OrderDetailsDrawer = ({ open, onClose, order, onEdit, onDelete }) => {
    const theme = useTheme();

    const productLabel = order?.products?.length > 1 ? 'Products' : 'Product';
    const header = `Order for <strong>${order?.products.length} ${productLabel}</strong>`;
    const user = `${order?.user.firstName} ${order?.user.lastName} - ${order?.user.email}`;

    const handleEdit = () => {
        onClose();
        onEdit(order);
    };

    const handleDelete = () => {
        onClose();
        onDelete(order);
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={paperPropsSx(theme)}
            sx={{ zIndex: 9999 }}
        >
            <CloseButton onClose={onClose} />
            <Box className="flex flex-col w-full mt-4 gap-4">
                {order ? (
                    <>
                        <div className='flex items-center justify-left gap-4'>
                            <Typography dangerouslySetInnerHTML={{ __html: header }} className='!text-lg' />
                            <TitleActions
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onExport={() => downloadOrderData(order)}
                            />
                        </div>

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

                        <CollapsibleProductList
                            products={order?.products || []}
                            label={productLabel}
                        />

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
                                label="Country"
                                value={order.address.country.name}
                                InputProps={CountryAdornment()}
                            />

                            <ReadOnlyTextField
                                label="City"
                                value={order.address.city.name}
                                InputProps={CityAdornment()}
                            />
                        </BoxBetween>

                        <ReadOnlyTextField
                            label="Street"
                            value={order.address.street}
                            InputProps={StreetAdornment()}
                        />

                        <ReadOnlyTextField
                            label="Phone Number"
                            value={order.address.phoneNumber}
                            InputProps={PhoneAdornment()}
                        />

                        {order.address.comment && (
                            <ReadOnlyTextField
                                label="Comment"
                                value={order.address.comment}
                                multiline
                                rows={2}
                                InputProps={CommentAdornment()}
                            />
                        )}

                        {order.paymentIntentId && (
                            <ReadOnlyTextField
                                label="Payment Intent Id"
                                value={order.paymentIntentId}
                                multiline
                                rows={2}
                                InputProps={IdAdornment()}
                            />
                        )}

                        <ReadOnlyTextField
                            label="Created At"
                            value={formatDateTime(order.createdAt)}
                            InputProps={DateAdornment()}
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

                        {order.updatedBy && (
                            <ReadOnlyTextField
                                label="Updated By"
                                value={`${order.updatedBy.firstName} ${order.updatedBy.lastName} - ${order.updatedBy.email}`}
                                InputProps={PersonAdornment()}
                            />
                        )}
                    </>
                ) : (
                    <ReadOnlyTextField value="Error fetching order" />
                )}
            </Box>
        </Drawer>
    );
};

export default OrderDetailsDrawer;