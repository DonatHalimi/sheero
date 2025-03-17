import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ActionButtons, CustomBox, CustomModal, CustomPaper, CustomTextField, CustomTypography, DashboardCountryFlag, handleApiError } from '../../../assets/CustomComponents';
import { editAddressService } from '../../../services/addressService';
import { getCitiesByCountryService } from '../../../services/cityService';
import { getCountriesService } from '../../../services/countryService';
import { AddressValidations } from '../../../utils/validations/address';

const EditAddressModal = ({ open, onClose, address, onViewDetails, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [street, setStreet] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [comment, setComment] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [cities, setCities] = useState([]);
    const [countriesWithGroups, setCountriesWithGroups] = useState([]);
    const [loading, setLoading] = useState(false);

    const validateName = (v) => AddressValidations.nameRules.pattern.test(v);
    const validatePhoneNumber = (v) => AddressValidations.phoneRules.pattern.test(v);
    const validateStreet = (v) => AddressValidations.streetRules.pattern.test(v);
    const validateComment = (v) => AddressValidations.commentRules.pattern.test(v);

    const isFormValid =
        validateName(name) &&
        validatePhoneNumber(phoneNumber) &&
        validateStreet(street) &&
        validateComment(comment) &&
        city &&
        country;

    useEffect(() => {
        if (address) {
            setName(address.name);
            setStreet(address.street);
            setPhoneNumber(address.phoneNumber);
            setComment(address.comment);
            setCity(address.city._id);
            setCountry(address.country._id);
        }

        const fetchCountries = async () => {
            try {
                const countriesResponse = await getCountriesService();
                const sortedCountries = countriesResponse.data.sort((a, b) => a.name.localeCompare(b.name));
                const countriesWithGroups = sortedCountries.map(country => ({
                    ...country,
                    firstLetter: country.name[0].toUpperCase()
                }));
                setCountriesWithGroups(countriesWithGroups);
            } catch (error) {
                console.error('Error fetching countries', error);
            }
        };

        fetchCountries();
    }, [address]);

    useEffect(() => {
        const fetchCitiesByCountry = async () => {
            if (country) {
                try {
                    const citiesResponse = await getCitiesByCountryService(country);
                    const sortedCities = citiesResponse.data.sort((a, b) => a.name.localeCompare(b.name));
                    setCities(sortedCities);
                } catch (error) {
                    console.error('Error fetching cities by country', error);
                }
            } else {
                setCities([]);
            }
        };

        fetchCitiesByCountry();
    }, [country]);

    const handleEditAddress = async () => {
        setLoading(true);

        const updatedData = {
            name,
            street,
            phoneNumber,
            comment: comment || null,
            city,
            country
        };

        try {
            const response = await editAddressService(address._id, updatedData);
            toast.success(response.data.message);
            onEditSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error updating address');
        } finally {
            setLoading(false);
        }
    };

    const handleCountryChange = (e, newValue) => {
        setCountry(newValue ? newValue._id : '');
        setCity('');
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit Address</CustomTypography>

                <CustomTextField
                    label="Name"
                    value={name}
                    setValue={setName}
                    validate={validateName}
                    validationRule={AddressValidations.nameRules}
                />

                <CustomTextField
                    label="Street"
                    value={street}
                    setValue={setStreet}
                    validate={validateStreet}
                    validationRule={AddressValidations.streetRules}
                />

                <CustomTextField
                    label="Phone Number"
                    value={phoneNumber}
                    setValue={setPhoneNumber}
                    validate={validatePhoneNumber}
                    validationRule={AddressValidations.phoneRules}
                    placeholder="044/45/48 XXXXXX"
                />

                <CustomTextField
                    label="Comment (Optional)"
                    value={comment}
                    setValue={setComment}
                    validate={validateComment}
                    validationRule={AddressValidations.commentRules}
                    multiline
                    rows={4}
                />

                <Autocomplete
                    id="country-autocomplete"
                    options={countriesWithGroups}
                    groupBy={(option) => option.firstLetter}
                    getOptionLabel={(option) => option.name}
                    value={countriesWithGroups.find((c) => c._id === country) || null}
                    onChange={handleCountryChange}
                    PaperComponent={CustomPaper}
                    fullWidth
                    renderOption={(props, option) => (
                        <li {...props} style={{ display: 'flex', alignItems: 'center' }}>
                            <DashboardCountryFlag countryCode={option.countryCode} name={option.name} />
                        </li>
                    )}
                    renderInput={(params) => <TextField {...params} label="Country" variant="outlined" />}
                    className='!mb-4'
                />

                <Autocomplete
                    options={cities}
                    getOptionLabel={(option) => option.name}
                    value={cities.find((c) => c._id === city) || null}
                    onChange={(e, newValue) => setCity(newValue ? newValue._id : '')}
                    renderInput={(params) => (
                        <TextField {...params} label="City" fullWidth className='!mb-4' />
                    )}
                />

                <ActionButtons
                    primaryButtonLabel="Save"
                    secondaryButtonLabel="View Details"
                    onPrimaryClick={handleEditAddress}
                    onSecondaryClick={() => {
                        onViewDetails(address);
                        onClose();
                    }}
                    primaryButtonProps={{
                        disabled: !isFormValid || loading
                    }}
                    loading={loading}
                />
            </CustomBox>
        </CustomModal>
    );
};

export default EditAddressModal;