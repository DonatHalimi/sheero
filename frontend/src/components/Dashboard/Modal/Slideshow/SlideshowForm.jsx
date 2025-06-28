import { Form, Formik } from 'formik';
import { toast } from 'react-toastify';
import { addSlideshowService, editSlideshowService } from '../../../../services/slideshowService';
import { getImageUrl } from '../../../../utils/config/config';
import { initialValues, validationSchema } from '../../../../utils/validations/slideshow';
import { FormSubmitButtons, ImageUploadBox } from '../../../custom/Dashboard';
import { CustomBox, CustomModal, CustomTextField, CustomTypography } from '../../../custom/MUI';
import { handleApiError } from '../../../custom/utils';

const SlideshowForm = ({
    open,
    onClose,
    slideshow = null,
    onSuccess,
    onViewDetails = null,
    isEdit = false
}) => {
    const handleSubmit = async (values, { setSubmitting }) => {
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);

        if (values.image && (!isEdit || typeof values.image !== 'string')) {
            formData.append('image', values.image);
        }

        try {
            let response;

            if (isEdit) {
                response = await editSlideshowService(slideshow._id, formData);
            } else {
                response = await addSlideshowService(formData);
            }

            toast.success(response.data.message);
            onSuccess(response.data);
            onClose();
        } catch (error) {
            const errorMessage = isEdit ? 'Error updating image' : 'Error adding image';
            handleApiError(error, errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox isScrollable>
                <CustomTypography variant="h5">{isEdit ? 'Edit Slideshow Image' : 'Add Slideshow Image'}</CustomTypography>

                <Formik
                    initialValues={initialValues(slideshow)}
                    validationSchema={validationSchema}
                    enableReinitialize
                    validateOnMount={isEdit}
                    onSubmit={handleSubmit}
                >
                    {({ values, isValid, dirty, setFieldValue, submitForm, isSubmitting }) => {
                        const isDisabled = (isEdit ? (!isValid || !dirty) : (!values.image || !isValid)) || isSubmitting;

                        return (
                            <Form>
                                <CustomTextField name="title" label="Title" />

                                <CustomTextField name="description" label="Description" />

                                <ImageUploadBox
                                    onFileSelect={(file) => setFieldValue('image', file)}
                                    initialPreview={slideshow?.image ? getImageUrl(slideshow.image) : ''}
                                />

                                <FormSubmitButtons
                                    isEdit={isEdit}
                                    onViewDetails={onViewDetails}
                                    submitForm={submitForm}
                                    isDisabled={isDisabled}
                                    loading={isSubmitting}
                                    item={slideshow}
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

export default SlideshowForm;