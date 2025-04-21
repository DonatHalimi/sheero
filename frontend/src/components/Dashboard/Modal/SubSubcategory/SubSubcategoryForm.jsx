import { Autocomplete, TextField } from '@mui/material';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CustomBox, CustomModal, CustomPaper, CustomTextField, CustomTypography, FormSubmitButtons } from '../../../../assets/CustomComponents';
import { getSubcategoriesService } from '../../../../services/subcategoryService';
import { addSubSubcategoryService, editSubSubcategoryService } from '../../../../services/subSubcategoryService';
import { initialValues, validationSchema } from '../../../../utils/validations/subSubcategory';

const SubSubcategoryForm = ({
    open,
    onClose,
    subSubcategory = null,
    onSuccess,
    onViewDetails = null,
    isEdit = false
}) => {
    const [subcategories, setSubcategories] = useState([]);

    useEffect(() => {
        const fetchSubcategories = async () => {
            try {
                const response = await getSubcategoriesService();
                const subCategoriesWithGroups = response.data.map(subCategory => ({
                    ...subCategory,
                    firstLetter: subCategory.name[0].toUpperCase()
                }));

                setSubcategories(subCategoriesWithGroups);
            } catch (error) {
                console.error('Error fetching subcategories', error);
                toast.error('Error fetching subcategories');
            }
        };

        fetchSubcategories();
    }, []);

    const handleSubmit = async (values, { setSubmitting }) => {
        const data = {
            ...values,
            subcategory: values.subcategory._id
        }

        try {
            let response;

            if (isEdit) {
                response = await editSubSubcategoryService(subSubcategory._id, data);
            } else {
                response = await addSubSubcategoryService(data);
            }
            toast.success(response.data.message);
            onSuccess(response.data);
            onClose();
        } catch (error) {
            const errorMessage = isEdit ? 'Error updating subSubcategory' : 'Error adding subSubcategory';
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
            <div style={{ width: '400px' }}>
                <CustomBox>
                    <CustomTypography variant="h5"> {isEdit ? 'Edit SubSubcategory' : 'Add SubSubcategory'}</CustomTypography>

                    <Formik
                        initialValues={initialValues(subSubcategory)}
                        validationSchema={validationSchema}
                        enableReinitialize
                        onSubmit={handleSubmit}
                    >
                        {({ values, errors, touched, setFieldValue, isValid, dirty, submitForm, isSubmitting }) => {
                            const isDisabled = !isValid || !dirty || isSubmitting;

                            return (
                                <Form>
                                    <CustomTextField name="name" label="Name" />

                                    <Autocomplete
                                        id="subcategory-autocomplete"
                                        options={subcategories.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                                        groupBy={(option) => option.firstLetter}
                                        getOptionLabel={(option) => option.name}
                                        value={values.subcategory}
                                        onChange={(event, newValue) => setFieldValue('subcategory', newValue)}
                                        PaperComponent={CustomPaper}
                                        fullWidth
                                        renderInput={(params) => (
                                            <TextField {...params} label="Subcategory" variant="outlined" error={touched.subSubcategory && !!errors.subSubcategory} helperText={touched.subSubcategory && errors.subSubcategory} />
                                        )}
                                        className='!mb-4'
                                    />

                                    <FormSubmitButtons
                                        isEdit={isEdit}
                                        onViewDetails={onViewDetails}
                                        submitForm={submitForm}
                                        isDisabled={isDisabled}
                                        loading={isSubmitting}
                                        item={subSubcategory}
                                        onClose={onClose}
                                    />
                                </Form>
                            );
                        }}
                    </Formik>
                </CustomBox>
            </div>
        </CustomModal>
    );
};

export default SubSubcategoryForm;