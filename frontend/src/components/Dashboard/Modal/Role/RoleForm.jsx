import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import { addRoleService, editRoleService } from '../../../../services/roleService';
import { initialValues, validationSchema } from '../../../../utils/validations/role';
import { FormSubmitButtons } from '../../../custom/Dashboard';
import { CustomBox, CustomModal, CustomTextField, CustomTypography } from '../../../custom/MUI';
import { handleApiError } from '../../../custom/utils';

const RoleForm = ({
    open,
    onClose,
    role = null,
    onSuccess,
    onViewDetails = null,
    isEdit = false
}) => {
    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            let response;

            if (isEdit) {
                response = await editRoleService(role._id, values);
            } else {
                response = await addRoleService(values);
            }
            toast.success(response.data.message);
            onSuccess(response.data);
            onClose();
        } catch (error) {
            const errorMessage = isEdit ? 'Error updating role' : 'Error adding role';
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
                <CustomTypography variant="h5"> {isEdit ? 'Edit Role' : 'Add Role'}</CustomTypography>

                <Formik
                    initialValues={initialValues(role)}
                    validationSchema={validationSchema}
                    enableReinitialize
                    onSubmit={handleSubmit}
                >
                    {({ isValid, dirty, submitForm, isSubmitting }) => {
                        const isDisabled = !isValid || !dirty || isSubmitting;

                        return (
                            <Form>
                                <CustomTextField name="name" label="Name" />

                                <CustomTextField name="description" label="Description" multiline rows={4} />

                                <FormSubmitButtons
                                    isEdit={isEdit}
                                    onViewDetails={onViewDetails}
                                    submitForm={submitForm}
                                    isDisabled={isDisabled}
                                    loading={isSubmitting}
                                    item={role}
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

export default RoleForm;