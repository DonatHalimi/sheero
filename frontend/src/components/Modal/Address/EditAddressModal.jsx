import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ActionButtons, BrownOutlinedTextField, CustomBox, CustomModal, CustomPaper, CustomTypography, DashboardCountryFlag, handleApiError } from '../../../assets/CustomComponents';
import { editAddressService } from '../../../services/addressService';
import { getCitiesByCountryService } from '../../../services/cityService';
import { getCountriesService } from '../../../services/countryService';

const EditAddressModal = ({ open, onClose, address, onViewDetails, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [isValidName, setIsValidName] = useState(true);
    const [street, setStreet] = useState('');
    const [isValidStreet, setIsValidStreet] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);
    const [comment, setComment] = useState('');
    const [isValidComment, setIsValidComment] = useState(true);
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [cities, setCities] = useState([]);
    const [countriesWithGroups, setCountriesWithGroups] = useState([]);

    const validateName = (v) => /^[A-ZÇ][a-zA-ZëËçÇ\s]{2,15}$/.test(v);
    const validatePhoneNumber = (v) => /^0(44|45|48|49)\d{6}$/.test(v);
    const validateStreet = (v) => /^[A-Z][a-zA-Z0-9\s]{2,27}$/.test(v);
    const validateComment = (v) => !v || /^[a-zA-Z0-9\s]{2,25}$/.test(v);

    const isValidForm =
        isValidName &&
        isValidStreet &&
        isValidPhoneNumber &&
        isValidComment &&
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

                <BrownOutlinedTextField
                    label="Name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                        setIsValidName(validateName(e.target.value));
                    }}
                    error={!isValidName}
                    helperText={!isValidName ? 'Name must start with a capital letter and be 2-10 characters long' : ''}
                    fullWidth
                    className='!mb-4'
                />

                <BrownOutlinedTextField
                    label="Street"
                    value={street}
                    onChange={(e) => {
                        setStreet(e.target.value)
                        setIsValidStreet(validateStreet(e.target.value));
                    }}
                    fullWidth
                    error={!isValidStreet}
                    helperText={!isValidStreet ? 'Street must start with a capital letter and be 2-27 characters long' : ''}
                    className='!mb-4'
                />

                <BrownOutlinedTextField
                    label="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => {
                        setPhoneNumber(e.target.value)
                        setIsValidPhoneNumber(validatePhoneNumber(e.target.value));
                    }}
                    fullWidth
                    placeholder="044/45/48 XXXXXX"
                    error={!isValidPhoneNumber}
                    helperText={!isValidPhoneNumber ? 'Phone number must start with 044, 045, 048 or 049 followed by 6 digits' : ''}
                    className='!mb-4'
                />

                <BrownOutlinedTextField
                    label="Comment (Optional)"
                    value={comment}
                    onChange={(e) => {
                        setComment(e.target.value)
                        setIsValidComment(validateComment(e.target.value));
                    }}
                    fullWidth
                    error={!isValidComment}
                    helperText={!isValidComment ? 'Comment must be 2-25 characters long' : ''}
                    multiline
                    rows={4}
                    className='!mb-4'
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
                        disabled: !isValidForm
                    }}
                />
            </CustomBox>
        </CustomModal>
    );
};

export default EditAddressModal;