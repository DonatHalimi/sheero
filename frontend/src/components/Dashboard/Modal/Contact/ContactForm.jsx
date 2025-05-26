import { Form, Formik } from 'formik';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addContactService } from '../../../../services/contactService';
import { initialValues, validationSchema } from '../../../../utils/validations/contact';
import { LoadingLabel } from '../../../custom/LoadingSkeletons';
import { BrownButton, CustomBox, CustomModal, CustomTextField, CustomTypography } from '../../../custom/MUI';
import { handleApiError } from '../../../custom/utils';

const ContactForm = ({
    open,
    onClose,
    onSuccess,
    isEdit = false
}) => {
    const { user } = useSelector((state) => state.auth);
    const values = initialValues({ name: user?.firstName, email: user?.email });

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            let response;

            response = await addContactService(values);

            toast.success(response.data.message);
            onSuccess(response.data);
            onClose();
        } catch (error) {
            const errorMessage = isEdit ? 'Error updating contact' : 'Error adding contact';
            handleApiError(error, errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">{isEdit ? 'Edit Contact' : 'Add Contact Message'}</CustomTypography>

                <Formik
                    initialValues={values}
                    validationSchema={validationSchema}
                    enableReinitialize
                    onSubmit={handleSubmit}
                >
                    {({ isValid, dirty, submitForm, isSubmitting }) => {
                        const isDisabled = !isValid || !dirty || isSubmitting;

                        return (
                            <Form>
                                <CustomTextField
                                    name="name"
                                    label="Name"
                                    disabled={!!user}
                                />

                                <CustomTextField
                                    name="email"
                                    label="Email"
                                    disabled={!!user}
                                />

                                <CustomTextField
                                    name="subject"
                                    label="Subject"
                                />

                                <CustomTextField
                                    name="message"
                                    label="Message"
                                    multiline
                                    rows={4}
                                />

                                <BrownButton
                                    onClick={submitForm}
                                    disabled={isDisabled}
                                    className="w-full"
                                >
                                    <LoadingLabel loading={isSubmitting} />
                                </BrownButton>
                            </Form>
                        );
                    }}
                </Formik>
            </CustomBox>
        </CustomModal>
    );
};

export default ContactForm;