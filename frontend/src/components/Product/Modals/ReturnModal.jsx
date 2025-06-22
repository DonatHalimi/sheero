import { Checkbox, FormControl, FormControlLabel, FormHelperText, InputLabel, ListItemText, MenuItem, Select, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoadingLabel, LoadingReturn } from '../../../components/custom/LoadingSkeletons';
import { BrownButton, CustomBox, CustomModal, CustomTextField } from '../../../components/custom/MUI';
import { getOrderDetailsService } from '../../../services/orderService';
import { addReturnRequestService } from '../../../services/returnService';
import { getImageUrl } from '../../../utils/config';
import { reasons } from '../../../utils/constants/validations/return';
import { returnModalInitialValues, returnModalValidationSchema } from '../../../utils/validations/return';

const ReturnModal = ({ open, onClose }) => {
    const { orderId } = useParams();
    const [orderProducts, setOrderProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (open && orderId) {
            fetchOrderDetails();
        }
    }, [open, orderId]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await getOrderDetailsService(orderId);
            if (response.data.success) {
                const products = response.data.data.products;
                setOrderProducts(products);
            } else {
                console.error('Failed to fetch order products');
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (values) => {
        setSubmitLoading(true);

        const returnData = {
            orderId: orderId,
            productIds: values.selectedProducts,
            reason: values.reason,
            customReason: values.reason === 'Other' ? values.customReason : undefined,
        };

        try {
            await addReturnRequestService(returnData);

            toast.success('Return request submitted successfully', {
                onClick: () => navigate('/profile/returns'),
            });
            onClose();
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.errors) {
                error.response.data.errors.forEach(err => {
                    toast.info(`${err.message}`, {
                        onClick: () => navigate('/profile/returns'),
                    });
                });
            } else {
                toast.error(error.response?.data?.message || 'Error submitting return request.');
            }
            console.error('Error submitting return request:', error);
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <Typography variant="h6" className='!mb-3'>
                    Return Products
                </Typography>
                {loading ? (
                    <LoadingReturn />
                ) : (
                    <Formik
                        initialValues={returnModalInitialValues(orderProducts)}
                        validationSchema={returnModalValidationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ values, errors, touched, dirty, handleChange, handleBlur, isValid }) => {
                            const isDisabled = !isValid || !dirty || submitLoading;

                            return (
                                <Form>
                                    <FormControl
                                        fullWidth
                                        error={touched.selectedProducts && Boolean(errors.selectedProducts)}
                                    >
                                        <InputLabel>Products</InputLabel>
                                        <Select
                                            multiple
                                            name="selectedProducts"
                                            value={values.selectedProducts}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            renderValue={(selected) =>
                                                selected
                                                    .map((id) => orderProducts.find(({ product }) => product._id === id)?.product.name)
                                                    .join(', ') || ''
                                            }
                                        >
                                            {orderProducts.map(({ product, quantity }) => (
                                                <MenuItem key={product._id} value={product._id} className='flex items-center'>
                                                    <Checkbox checked={values.selectedProducts.indexOf(product._id) > -1} />
                                                    <img
                                                        src={getImageUrl(product.image)}
                                                        alt={product.name}
                                                        className='w-7 h-7 object-contain mr-2'
                                                    />
                                                    <ListItemText
                                                        primary={
                                                            <Typography
                                                                variant="body2"
                                                                noWrap
                                                                style={{ maxWidth: 300 }}
                                                            >
                                                                {product.name}
                                                            </Typography>
                                                        }
                                                        secondary={`Qty: ${quantity}`}
                                                    />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {touched.selectedProducts && errors.selectedProducts && (
                                            <FormHelperText>{errors.selectedProducts}</FormHelperText>
                                        )}
                                    </FormControl>

                                    <FormControl
                                        fullWidth
                                        margin="normal"
                                        error={touched.reason && Boolean(errors.reason)}
                                    >
                                        <InputLabel>Reason for Return</InputLabel>
                                        <Select
                                            name="reason"
                                            value={values.reason}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            label="Reason for Return"
                                        >
                                            {reasons.map((r) => (
                                                <MenuItem key={r} value={r}>
                                                    {r}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {touched.reason && errors.reason && (
                                            <FormHelperText>{errors.reason}</FormHelperText>
                                        )}
                                    </FormControl>

                                    {values.reason === 'Other' && (
                                        <div className="mt-4">
                                            <CustomTextField
                                                name="customReason"
                                                label="Please specify a reason"
                                                multiline
                                                rows={3}
                                                variant="outlined"
                                            />
                                        </div>
                                    )}

                                    <FormControl
                                        fullWidth
                                        error={touched.confirmSelection && Boolean(errors.confirmSelection)}
                                    >
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    name="confirmSelection"
                                                    checked={values.confirmSelection}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    color="primary"
                                                />
                                            }
                                            label="I confirm the selected products are correct"
                                        />
                                        {touched.confirmSelection && errors.confirmSelection && (
                                            <FormHelperText>{errors.confirmSelection}</FormHelperText>
                                        )}
                                    </FormControl>

                                    <BrownButton
                                        type="submit"
                                        disabled={isDisabled}
                                        fullWidth
                                        className='!mt-3'
                                    >
                                        <LoadingLabel loading={submitLoading} defaultLabel="Submit" loadingLabel="Submitting" />
                                    </BrownButton>
                                </Form>
                            );
                        }}
                    </Formik>
                )}
            </CustomBox>
        </CustomModal>
    );
};

export default ReturnModal;