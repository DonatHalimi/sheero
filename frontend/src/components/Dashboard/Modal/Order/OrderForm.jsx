import { Box, MenuItem, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import { editOrderService } from '../../../../services/orderService';
import { statusOptions } from '../../../../utils/constants/validations/order';
import { initialValues, validationSchema } from '../../../../utils/validations/order';
import { DateAdornment, DeliveryStatusAdornment, EuroAdornment, IdAdornment, PaymentMethodAdornment, PersonAdornment } from '../../../custom/Adornments';
import { ActionButtons, CollapsibleProductList } from '../../../custom/Dashboard';
import { BoxBetween, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, ReadOnlyTextField } from '../../../custom/MUI';
import { formatDate, handleApiError } from '../../../custom/utils';

const OrderForm = ({
    open,
    onClose,
    order = null,
    onSuccess,
    onViewDetails = null,
    isEdit = true
}) => {
    if (!order) return null;

    const user = `${order?.user?.firstName} ${order?.user?.lastName} - ${order?.user?.email}`;
    const productLabel = order?.products?.length > 1 ? 'Products' : 'Product';
    const arrivalDateRange = order?.arrivalDateRange ? `${formatDate(order.arrivalDateRange.start)} - ${formatDate(order.arrivalDateRange.end)}` : '';

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success('Order ID copied to clipboard!');
        });
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        const data = {
            orderId: order._id,
            status: values.status,
        };

        if (order.paymentMethod === 'cash') {
            data.paymentStatus = values.status === 'delivered' ? 'completed' : values.status === 'canceled' ? 'failed' : 'pending';
        }

        try {
            const response = await editOrderService(data);

            toast.success(response.data.message, {
                onClick: () => copyToClipboard(order._id),
                autoClose: 6000
            });

            onSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error updating order status');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isEdit) return null;

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox isScrollable>
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

                <CollapsibleProductList
                    products={order?.products || []}
                    label={productLabel}
                />

                <BoxBetween className="!mt-4">
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

                <Formik
                    initialValues={initialValues(order)}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, dirty, isValid, handleChange, isSubmitting }) => {
                        const isDisabled = !isValid || !dirty || isSubmitting;

                        return (
                            <Form>
                                <BrownOutlinedTextField
                                    select
                                    fullWidth
                                    label="Delivery Status"
                                    name="status"
                                    value={values.status}
                                    onChange={handleChange}
                                    error={touched.status && Boolean(errors.status)}
                                    helperText={touched.status && errors.status}
                                    className="!mb-4"
                                >
                                    {statusOptions.map((status) => (
                                        <MenuItem key={status} value={status}>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                {DeliveryStatusAdornment(status).startAdornment}
                                                <Typography>{status.charAt(0).toUpperCase() + status.slice(1)}</Typography>
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </BrownOutlinedTextField>

                                <ActionButtons
                                    primaryButtonLabel="Save"
                                    secondaryButtonLabel="View Details"
                                    onSecondaryClick={() => {
                                        onViewDetails(order);
                                        onClose();
                                    }}
                                    primaryButtonProps={{
                                        type: "submit",
                                        disabled: isDisabled
                                    }}
                                    loading={isSubmitting}
                                />
                            </Form>
                        );
                    }}
                </Formik>
            </CustomBox>
        </CustomModal>
    );
};

export default OrderForm;