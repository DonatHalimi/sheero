import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import { addCategoryService, editCategoryService } from '../../../../services/categoryService';
import { getImageUrl } from '../../../../utils/config';
import { initialValues, validationSchema } from '../../../../utils/validations/category';
import { FormSubmitButtons, ImageUploadBox } from '../../../custom/Dashboard';
import { CustomBox, CustomModal, CustomTextField, CustomTypography } from '../../../custom/MUI';
import { handleApiError } from '../../../custom/utils';

const CategoryForm = ({
    open,
    onClose,
    category = null,
    onSuccess,
    onViewDetails = null,
    isEdit = false
}) => {
    const handleSubmit = async (values, { setSubmitting }) => {
        const formData = new FormData();
        formData.append('name', values.name);

        if (values.image && (!isEdit || typeof values.image !== 'string')) {
            formData.append('image', values.image);
        }

        try {
            let response;

            if (isEdit) {
                response = await editCategoryService(category._id, formData);
            } else {
                response = await addCategoryService(formData);
            }

            toast.success(response.data.message);
            onSuccess(response.data);
            onClose();
        } catch (error) {
            const errorMessage = isEdit ? 'Error updating category' : 'Error adding category';
            handleApiError(error, errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox isScrollable>
                <CustomTypography variant="h5">{isEdit ? 'Edit Category' : 'Add Category'}</CustomTypography>

                <Formik
                    initialValues={initialValues(category)}
                    validationSchema={validationSchema}
                    enableReinitialize
                    validateOnMount={isEdit}
                    onSubmit={handleSubmit}
                >
                    {({ values, isValid, dirty, setFieldValue, submitForm, isSubmitting }) => {
                        const isDisabled = (isEdit ? (!isValid || !dirty) : (!values.image || !isValid)) || isSubmitting;

                        return (
                            <Form>
                                <CustomTextField name="name" label="Name" />

                                <ImageUploadBox
                                    onFileSelect={(file) => setFieldValue('image', file)}
                                    initialPreview={category?.image ? getImageUrl(category.image) : ''}
                                />

                                <FormSubmitButtons
                                    isEdit={isEdit}
                                    onViewDetails={onViewDetails}
                                    submitForm={submitForm}
                                    isDisabled={isDisabled}
                                    loading={isSubmitting}
                                    item={category}
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

export default CategoryForm;