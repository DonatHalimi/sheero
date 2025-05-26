import { Autocomplete, TextField } from '@mui/material';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { addAddressService, editAddressService } from '../../../../services/addressService';
import { getCitiesByCountryService } from '../../../../services/cityService';
import { getCountriesService } from '../../../../services/countryService';
import { initialValues, validationSchema } from '../../../../utils/validations/address';
import { FormSubmitButtons } from '../../../custom/Dashboard';
import { CustomBox, CustomModal, CustomPaper, CustomTextField, CustomTypography } from '../../../custom/MUI';

const AddressForm = ({
    open,
    onClose,
    address = null,
    onSuccess,
    onViewDetails = null,
    isEdit = false
}) => {
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        getCountriesService().then(({ data }) =>
            setCountries(data.map(c => ({ ...c, firstLetter: c.name[0].toUpperCase() })))
        ).catch(err => console.error('Error fetching countries', err));
    }, []);

    const handleCountryChange = async (setFieldValue, newValue) => {
        setFieldValue('country', newValue);
        setFieldValue('city', null);
        if (newValue) {
            try {
                const { data } = await getCitiesByCountryService(newValue._id);
                setCities(data.map(city => ({ ...city, firstLetter: city.name[0].toUpperCase() })));
            } catch {
                setCities([]);
            }
        }
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        const data = {
            ...values,
            comment: values.comment || null,
            city: values.city._id,
            country: values.country._id
        };

        try {
            let response = isEdit ? await editAddressService(address._id, data) : await addAddressService(data);
            toast.success(response.data.message);
            onSuccess(response.data);
            onClose();
        } catch (error) {
            if (error.response?.data?.errors) {
                error.response.data.errors.forEach(err => toast.error(err.message));
            } else {
                toast.error(isEdit ? 'Error updating address' : 'Error adding address');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">{isEdit ? 'Edit Address' : 'Add Address'}</CustomTypography>

                <Formik
                    initialValues={initialValues(address)}
                    validationSchema={validationSchema}
                    enableReinitialize
                    onSubmit={handleSubmit}
                >
                    {({ values, errors, touched, isValid, dirty, setFieldValue, submitForm, isSubmitting }) => {
                        const isDisabled = !isValid || !dirty || isSubmitting;

                        return (
                            <Form>
                                <CustomTextField name="name" label="Name" />

                                <CustomTextField name="street" label="Street" />

                                <CustomTextField name="phoneNumber" label="Phone Number" placeholder="043/44/45/46/47/48/49 XXXXXX" />

                                <CustomTextField name="comment" label="Comment (Optional)" multilinerows={4} />

                                <Autocomplete
                                    id="country-autocomplete"
                                    options={countries.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                                    groupBy={option => option.firstLetter}
                                    getOptionLabel={option => option.name}
                                    value={values.country}
                                    onChange={(e, newValue) => handleCountryChange(setFieldValue, newValue)}
                                    PaperComponent={CustomPaper}
                                    renderInput={params => (
                                        <TextField {...params} label="Country" variant="outlined" error={touched.country && !!errors.country} helperText={touched.country && errors.country} />
                                    )}
                                    className='!mb-4'
                                />

                                <Autocomplete
                                    id="city-autocomplete"
                                    options={cities.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                                    groupBy={option => option.firstLetter}
                                    getOptionLabel={option => option.name}
                                    value={values.city}
                                    onChange={(e, newValue) => setFieldValue('city', newValue)}
                                    PaperComponent={CustomPaper}
                                    renderInput={params => (
                                        <TextField {...params} label="City" variant="outlined" error={touched.city && !!errors.city} helperText={touched.city && errors.city} />
                                    )}
                                    className='!mb-4'
                                />

                                <FormSubmitButtons
                                    isEdit={isEdit}
                                    onViewDetails={onViewDetails}
                                    submitForm={submitForm}
                                    isDisabled={isDisabled}
                                    loading={isSubmitting}
                                    item={address}
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

export default AddressForm;