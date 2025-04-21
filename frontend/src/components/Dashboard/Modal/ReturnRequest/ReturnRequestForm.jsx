import { Box, MenuItem, Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import React from 'react';
import { toast } from 'react-toastify';
import {
    ActionButtons, BrownOutlinedTextField, CollapsibleProductList, CustomBox, CustomModal,
    CustomTypography, DescriptionAdornment, handleApiError, IdAdornment, PersonAdornment, ReadOnlyTextField, ReturnStatusAdornment
} from '../../../../assets/CustomComponents';
import { editReturnRequestStatusService } from '../../../../services/returnService';
import { statusOptions } from '../../../../utils/constants/validations/return';
import { initialValues, validationSchema } from '../../../../utils/validations/return';

const ReturnRequestForm = ({
    open,
    onClose,
    returnRequest = null,
    onSuccess,
    onViewDetails = null,
    isEdit = true
}) => {
    if (!returnRequest) return null;

    const user = `${returnRequest?.user.firstName} ${returnRequest?.user.lastName} - ${returnRequest?.user.email}`;
    const products = Array.isArray(returnRequest?.products)
        ? returnRequest.products
        : typeof returnRequest?.products === 'string'
            ? returnRequest.products.split(', ').map((productName, index) => ({
                _id: `unknown-${index}`,
                name: productName.trim(),
            })) : [];

    const transformedProducts = products.map(product => ({ product }));
    const productLabel = products.length === 1 ? 'Product' : 'Products';

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success('Return Request ID copied to clipboard!');
        });
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        const data = {
            status: values.status
        };

        try {
            const response = await editReturnRequestStatusService(returnRequest._id, data);

            toast.success(response.data.message, {
                onClick: () => copyToClipboard(returnRequest._id),
                autoClose: 6000
            });

            onSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error updating return request');
        } finally {
            setSubmitting(false);
        }
    };

    if (!isEdit) return null;

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox isScrollable>
                <CustomTypography variant="h5">Edit Return Request Status</CustomTypography>

                <ReadOnlyTextField
                    label="Order ID"
                    value={returnRequest?.order}
                    InputProps={IdAdornment()}
                    className="!mb-4"
                />

                <ReadOnlyTextField
                    label="User"
                    value={user}
                    InputProps={PersonAdornment()}
                    className="!mb-4"
                />

                <Box className="!mb-3">
                    <CollapsibleProductList
                        products={transformedProducts}
                        label={productLabel}
                        isOrder={false}
                    />
                </Box>

                <ReadOnlyTextField
                    label="Reason"
                    value={returnRequest?.reason}
                    InputProps={DescriptionAdornment()}
                    className="!mb-4"
                />

                {returnRequest?.reason === 'Other' && returnRequest?.customReason && (
                    <ReadOnlyTextField
                        label="Custom Reason"
                        value={returnRequest?.customReason}
                        InputProps={DescriptionAdornment()}
                        className="!mb-4"
                    />
                )}

                <Formik
                    initialValues={initialValues(returnRequest)}
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
                                    label="Return Request Status"
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
                                                {ReturnStatusAdornment(status).startAdornment}
                                                <Typography>{status.charAt(0).toUpperCase() + status.slice(1)}</Typography>
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </BrownOutlinedTextField>

                                <ActionButtons
                                    primaryButtonLabel="Save"
                                    secondaryButtonLabel="View Details"
                                    onSecondaryClick={() => {
                                        onViewDetails(returnRequest);
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

export default ReturnRequestForm;