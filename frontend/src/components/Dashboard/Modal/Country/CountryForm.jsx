import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import { CustomBox, CustomModal, CustomTextField, CustomTypography, FormSubmitButtons } from '../../../../assets/CustomComponents';
import { addCountryService, editCountryService } from '../../../../services/countryService';
import { initialValues, validationSchema } from '../../../../utils/validations/country';

const CountryForm = ({
    open,
    onClose,
    country = null,
    onSuccess,
    onViewDetails = null,
    isEdit = false
}) => {
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            let response;

            if (isEdit) {
                response = await editCountryService(country._id, values);
            } else {
                response = await addCountryService(values);
            }
            toast.success(response.data.message);
            onSuccess(response.data);
            onClose();
        } catch (error) {
            const errorMessage = isEdit ? 'Error updating country' : 'Error adding country';
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
                <CustomTypography variant="h5"> {isEdit ? 'Edit Country' : 'Add Country'}</CustomTypography>

                <Formik
                    initialValues={initialValues(country)}
                    validationSchema={validationSchema}
                    enableReinitialize
                    onSubmit={handleSubmit}
                >
                    {({ isValid, dirty, submitForm, isSubmitting }) => {
                        const isDisabled = !isValid || !dirty || isSubmitting;

                        return (
                            <Form>
                                <CustomTextField name="name" label="Name" />

                                <CustomTextField name="countryCode" label="Country Code" />

                                <FormSubmitButtons
                                    isEdit={isEdit}
                                    onViewDetails={onViewDetails}
                                    submitForm={submitForm}
                                    isDisabled={isDisabled}
                                    loading={isSubmitting}
                                    item={country}
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

export default CountryForm;