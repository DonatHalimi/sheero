import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import { addFAQService, editFAQService } from '../../../../services/faqService';
import { initialValues, validationSchema } from '../../../../utils/validations/faq';
import { FormSubmitButtons } from '../../../custom/Dashboard';
import { CustomBox, CustomModal, CustomTextField, CustomTypography } from '../../../custom/MUI';
import { handleApiError } from '../../../custom/utils';

const FAQForm = ({
    open,
    onClose,
    faq = null,
    onSuccess,
    onViewDetails = null,
    isEdit = false
}) => {
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            let response;

            if (isEdit) {
                response = await editFAQService(faq._id, values);
            } else {
                response = await addFAQService(values);
            }
            toast.success(response.data.message);
            onSuccess(response.data);
            onClose();
        } catch (error) {
            const errorMessage = isEdit ? 'Error updating FAQ' : 'Error adding FAQ';
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
                <CustomTypography variant="h5"> {isEdit ? 'Edit FAQ' : 'Add FAQ'}</CustomTypography>

                <Formik
                    initialValues={initialValues(faq)}
                    validationSchema={validationSchema}
                    enableReinitialize
                    onSubmit={handleSubmit}
                >
                    {({ isValid, dirty, submitForm, isSubmitting }) => {
                        const isDisabled = !isValid || !dirty || isSubmitting;

                        return (
                            <Form>
                                <CustomTextField name="question" label="Question" multiline rows={4} />

                                <CustomTextField name="answer" label="Answer" multiline rows={4} />

                                <FormSubmitButtons
                                    isEdit={isEdit}
                                    onViewDetails={onViewDetails}
                                    submitForm={submitForm}
                                    isDisabled={isDisabled}
                                    loading={isSubmitting}
                                    item={faq}
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

export default FAQForm;