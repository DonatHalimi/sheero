import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomPaper, CustomTypography, DashboardCountryFlag, handleApiError, LoadingLabel } from '../../../assets/CustomComponents';
import { addAddressService } from '../../../services/addressService';
import { getCitiesByCountryService } from '../../../services/cityService';
import { getCountriesService } from '../../../services/countryService';

const AddAddressModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [isValidName, setIsValidName] = useState(true);
    const [street, setStreet] = useState('');
    const [isValidStreet, setIsValidStreet] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);
    const [comment, setComment] = useState('');
    const [isValidComment, setIsValidComment] = useState(true);
    const [city, setCity] = useState(null);
    const [country, setCountry] = useState(null);
    const [cities, setCities] = useState([]);
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);

    const validateName = (v) => /^[A-ZÇ][a-zA-ZëËçÇ\s]{2,10}$/.test(v);
    const validatePhoneNumber = (v) => /^0(43|44|45|46|47|48|49)\d{6}$/.test(v);
    const validateStreet = (v) => /^[A-Z][a-zA-Z0-9\s]{2,27}$/.test(v);
    const validateComment = (v) => !v || /^[a-zA-Z0-9\s]{2,25}$/.test(v);

    const isFormValid =
        isValidName &&
        isValidStreet &&
        isValidPhoneNumber &&
        isValidComment &&
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

                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value);
                        setIsValidName(validateName(e.target.value));
                    }}
                    error={!isValidName}
                    helperText={!isValidName ? "Name must start with a capital letter and be 2-10 characters long" : ""}
                    className="!mb-4"
                />

                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Street"
                    value={street}
                    onChange={(e) => {
                        setStreet(e.target.value);
                        setIsValidStreet(validateStreet(e.target.value));
                    }}
                    error={!isValidStreet}
                    helperText={!isValidStreet ? "Street must start with a capital letter and be 2-27 characters long" : ""}
                    className="!mb-4"
                />

                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => {
                        setPhoneNumber(e.target.value)
                        setIsValidPhoneNumber(validatePhoneNumber(e.target.value));
                    }}
                    placeholder="044/45/48 XXXXXX"
                    error={!isValidPhoneNumber}
                    helperText={!isValidPhoneNumber ? "Phone number must start with 043, 044, 045, 046, 047, 048 or 049 followed by 6 digits" : ""}
                    className="!mb-4"
                />

                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Comment (Optional)"
                    value={comment}
                    onChange={(e) => {
                        setComment(e.target.value)
                        setIsValidComment(validateComment(e.target.value));
                    }}
                    error={!isValidComment}
                    helperText={!isValidComment ? "Comment must be 2-25 characters long" : ""}
                    multiline
                    rows={4}
                    className="!mb-4"
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