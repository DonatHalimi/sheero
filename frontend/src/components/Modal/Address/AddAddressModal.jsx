import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, CustomBox, CustomModal, CustomPaper, CustomTextField, CustomTypography, DashboardCountryFlag, handleApiError, LoadingLabel } from '../../../assets/CustomComponents';
import { addAddressService } from '../../../services/addressService';
import { getCitiesByCountryService } from '../../../services/cityService';
import { getCountriesService } from '../../../services/countryService';
import { AddressValidations } from '../../../utils/validations/address';

const AddAddressModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [street, setStreet] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [comment, setComment] = useState('');
    const [city, setCity] = useState(null);
    const [country, setCountry] = useState(null);
    const [cities, setCities] = useState([]);
    const [countries, setCountries] = useState([]);
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
        const fetchCountries = async () => {
            try {
                const response = await getCountriesService();
                const countriesWithGroups = response.data.map(country => ({
                    ...country,
                    firstLetter: country.name[0].toUpperCase()
                }));
                setCountries(countriesWithGroups);
            } catch (error) {
                console.error('Error fetching countries', error);
            }
        };

        fetchCountries();
    }, []);

    const handleCountryChange = async (event, newValue) => {
        setCountry(newValue);
        setCity(null);
        if (newValue) {
            try {
                const response = await getCitiesByCountryService(newValue._id);
                const citiesWithGroups = response.data.map(city => ({
                    ...city,
                    firstLetter: city.name[0].toUpperCase()
                }));
                setCities(citiesWithGroups);
            } catch (error) {
                console.error('Error fetching cities for selected country', error);
            }
        } else {
            setCities([]);
        }
    };

    const handleAddAddress = async () => {
        setLoading(true);
        if (!name || !street || !phoneNumber || !city || !country) {
            toast.error('Please fill in all the fields');
            return;
        }

        const data = {
            name,
            street,
            phoneNumber,
            comment: comment || null,
            city: city?._id,
            country: country?._id
        };

        try {
            const response = await addAddressService(data);
            toast.success(response.data.message);
            onAddSuccess();
            onClose();
        } catch (error) {
            handleApiError(error, 'Error adding address');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Add Address</CustomTypography>

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
                    options={countries.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                    groupBy={(option) => option.firstLetter}
                    getOptionLabel={(option) => option.name}
                    value={country}
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
                    id="city-autocomplete"
                    options={cities.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                    groupBy={(option) => option.firstLetter}
                    getOptionLabel={(option) => option.name}
                    value={city}
                    onChange={(event, newValue) => setCity(newValue)}
                    PaperComponent={CustomPaper}
                    fullWidth
                    required
                    renderInput={(params) => <TextField {...params} label="City" variant="outlined" />}
                    className='!mb-4'
                />

                <BrownButton
                    onClick={handleAddAddress}
                    variant="contained"
                    color="primary"
                    disabled={!isFormValid || loading}
                    className="w-full"
                >
                    <LoadingLabel loading={loading} defaultLabel="Add" />
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddAddressModal;