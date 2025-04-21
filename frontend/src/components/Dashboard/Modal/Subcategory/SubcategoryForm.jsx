import { Autocomplete, TextField } from '@mui/material';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CustomBox, CustomModal, CustomPaper, CustomTextField, CustomTypography, FormSubmitButtons, ImageUploadBox } from '../../../../assets/CustomComponents';
import { getCategoriesService } from '../../../../services/categoryService';
import { addSubcategoryService, editSubcategoryService } from '../../../../services/subcategoryService';
import { getImageUrl } from '../../../../utils/config';
import { initialValues, validationSchema } from '../../../../utils/validations/subcategory';

const SubcategoryForm = ({
    open,
    onClose,
    subcategory = null,
    onSuccess,
    onViewDetails = null,
    isEdit = false
}) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategoriesService();
                setCategories(response.data.map(c => ({ ...c, firstLetter: c.name[0].toUpperCase() })));
            } catch (error) {
                console.error('Error fetching categories', error);
                toast.error('Error fetching categories');
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (values, { setSubmitting }) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('category', values.category._id);

        if (values.image && (!isEdit || typeof values.image !== 'string')) {
            formData.append('image', values.image);
        }

        try {
            let response;

            if (isEdit) {
                response = await editSubcategoryService(subcategory._id, formData);
            } else {
                response = await addSubcategoryService(formData);
            }

            toast.success(response.data.message);
            onSuccess(response.data);
            onClose();
        } catch (error) {
            const errorMessage = isEdit ? 'Error updating subcategory' : 'Error adding subcategory';
            handleApiError(error, errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5"> {isEdit ? 'Edit Subcategory' : 'Add Subcategory'}</CustomTypography>

                <Formik
                    initialValues={initialValues(subcategory)}
                    validationSchema={validationSchema}
                    enableReinitialize
                    onSubmit={handleSubmit}
                >
                    {({ values, isValid, dirty, setFieldValue, submitForm, isSubmitting }) => {
                        const isDisabled = !isValid || !dirty || isSubmitting;

                        return (
                            <Form>
                                <CustomTextField name="name" label="Name" />

                                <Autocomplete
                                    id="category-autocomplete"
                                    options={categories.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                                    groupBy={(option) => option.firstLetter}
                                    getOptionLabel={(option) => option.name}
                                    value={values.category || null}
                                    onChange={(event, newValue) => setFieldValue('category', newValue)}
                                    PaperComponent={CustomPaper}
                                    fullWidth
                                    renderInput={(params) => <TextField {...params} label="Category" variant="outlined" />}
                                    className='!mb-4'
                                />

                                <ImageUploadBox
                                    onFileSelect={(file) => setFieldValue('image', file)}
                                    initialPreview={subcategory?.image ? getImageUrl(subcategory.image) : ''}
                                />

                                <FormSubmitButtons
                                    isEdit={isEdit}
                                    onViewDetails={onViewDetails}
                                    submitForm={submitForm}
                                    isDisabled={isDisabled}
                                    loading={isSubmitting}
                                    item={subcategory}
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

export default SubcategoryForm;