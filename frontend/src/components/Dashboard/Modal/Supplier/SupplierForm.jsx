import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import { addSupplierService, editSupplierService } from '../../../../services/supplierService';
import { initialValues, validationSchema } from '../../../../utils/validations/supplier';
import { FormSubmitButtons } from '../../../custom/Dashboard';
import { CustomBox, CustomModal, CustomTextField, CustomTypography } from '../../../custom/MUI';
import { handleApiError } from '../../../custom/utils';

const SupplierForm = ({
    open,
    onClose,
    supplier = null,
    onSuccess,
    onViewDetails = null,
    isEdit = false
}) => {
    const handleSubmit = async (values, { setSubmitting }) => {
        const data = {
            name: values.name,
            contactInfo: {
                email: values.email,
                phoneNumber: values.phoneNumber,
            },
        };

        try {
            let response;

            if (isEdit) {
                response = await editSupplierService(supplier._id, data);
            } else {
                response = await addSupplierService(data);
            }
            toast.success(response.data.message);
            onSuccess(response.data);
            onClose();
        } catch (error) {
            const errorMessage = isEdit ? 'Error updating supplier' : 'Error adding supplier';
            if (typeof handleApiError === 'function') {
                handleApiError(error, errorMessage);
            } else {
                toast.error(errorMessage);
                console.error(error);
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5"> {isEdit ? 'Edit Supplier' : 'Add Supplier'}</CustomTypography>

                <Formik
                    initialValues={initialValues(supplier)}
                    validationSchema={validationSchema}
                    enableReinitialize
                    onSubmit={handleSubmit}
                >
                    {({ isValid, dirty, submitForm, isSubmitting }) => {
                        const isDisabled = !isValid || !dirty || isSubmitting;

                        return (
                            <Form>
                                <CustomTextField name="name" label="Name" />

                                <CustomTextField name="email" label="Email" />

                                <CustomTextField label="Phone Number" name="phoneNumber" />

                                <FormSubmitButtons
                                    isEdit={isEdit}
                                    onViewDetails={onViewDetails}
                                    submitForm={submitForm}
                                    isDisabled={isDisabled}
                                    loading={isSubmitting}
                                    item={supplier}
                                    onClose={onClose}
                                />
                            </Form>
                        );
                    }}
                </Formik>
            </CustomBox>
        </CustomModal>
    );
};

export default SupplierForm;