import { Autocomplete, TextField } from '@mui/material';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CustomBox, CustomModal, CustomPaper, CustomTextField, CustomTypography, DashboardCountryFlag, FormSubmitButtons } from '../../../../assets/CustomComponents';
import { addCityService, editCityService } from '../../../../services/cityService';
import { getCountriesService } from '../../../../services/countryService';
import { initialValues, validationSchema } from '../../../../utils/validations/city';

const CityForm = ({
    open,
    onClose,
    city = null,
    onSuccess,
    onViewDetails = null,
    isEdit = false
}) => {
    const [countriesWithGroups, setCountriesWithGroups] = useState([]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await getCountriesService();
                setCountriesWithGroups(response.data.map(c => ({ ...c, firstLetter: c.name[0].toUpperCase() })));
            } catch {
                toast.error('Error fetching countries');
            }
        };

        fetchCountries();
    }, []);

    const handleSubmit = async (values, { setSubmitting }) => {
        const data = {
            ...values,
            country: values.country._id
        };

        try {
            let response;

            if (isEdit) {
                response = await editCityService(city._id, data);
            } else {
                response = await addCityService(data);
            }
            toast.success(response.data.message);
            onSuccess(response.data);
            onClose();
        } catch (error) {
            const errorMessage = isEdit ? 'Error updating city' : 'Error adding city';
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
                    <CustomTypography variant="h5"> {isEdit ? 'Edit City' : 'Add City'}</CustomTypography>

                    <Formik
                        initialValues={initialValues(city)}
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
                                        id="country-autocomplete"
                                        options={countriesWithGroups}
                                        groupBy={(option) => option.firstLetter}
                                        getOptionLabel={(option) => option.name}
                                        value={values.country || null}
                                        onChange={(e, newValue) => setFieldValue('country', newValue)}
                                        PaperComponent={CustomPaper}
                                        fullWidth
                                        renderOption={(props, option) => (
                                            <li {...props} style={{ display: 'flex', alignItems: 'center' }}>
                                                <DashboardCountryFlag countryCode={option.countryCode} />
                                                {option.name}
                                            </li>
                                        )}
                                        renderInput={(params) => <TextField {...params} label="Country" variant="outlined" />}
                                        className='!mb-4'
                                    />

                                    <CustomTextField name="zipCode" label="Zip Code" />

                                    <FormSubmitButtons
                                        isEdit={isEdit}
                                        onViewDetails={onViewDetails}
                                        submitForm={submitForm}
                                        isDisabled={isDisabled}
                                        loading={isSubmitting}
                                        item={city}
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

export default CityForm;