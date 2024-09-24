import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomPaper, CustomTypography } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';

const AddAddressModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [street, setStreet] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [city, setCity] = useState(null);
    const [country, setCountry] = useState(null);
    const [cities, setCities] = useState([]);
    const [countries, setCountries] = useState([]);

    const [nameValid, setNameValid] = useState(true);
    const [streetValid, setStreetValid] = useState(true);
    const [phoneNumberValid, setPhoneNumberValid] = useState(true);

    const axiosInstance = useAxios();

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axiosInstance.get('/countries/get');
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
    }, [axiosInstance]);

    const handleCountryChange = async (event, newValue) => {
        setCountry(newValue);
        setCity(null);
        if (newValue) {
            try {
                const response = await axiosInstance.get(`/cities/country/${newValue._id}`);
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

    const validateName = (name) => {
        return name.trim().length > 0; // Adjust as necessary
    };

    const validateStreet = (street) => {
        return street.trim().length > 0; // Adjust as necessary
    };

    const validatePhoneNumber = (phoneNumber) => {
        return /^\d{3}\/\d{2}\/\d{2} \d{6}$/.test(phoneNumber); // Adjust regex as necessary
    };

    const handleAddAddress = async () => {
        setNameValid(validateName(name));
        setStreetValid(validateStreet(street));
        setPhoneNumberValid(validatePhoneNumber(phoneNumber));

        if (!nameValid || !streetValid || !phoneNumberValid || !city || !country) {
            toast.error('Please fill in all fields correctly', { closeOnClick: true });
            return;
        }

        try {
            await axiosInstance.post('/addresses/create', {
                name,
                street,
                phoneNumber,
                city: city._id,
                country: country._id
            });
            toast.success('Address added successfully');
            onAddSuccess();
            onClose();
        } catch (error) {
            if (error.response && error.response.status === 403) {
                toast.error('You do not have permission to perform this action');
            } else {
                toast.error('Error adding address');
            }
            console.error('Error adding address', error);
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
                        setNameValid(validateName(e.target.value));
                    }}
                    className="!mb-4"
                />
                {!nameValid && <div className="text-red-500 text-sm mb-2">Name is required.</div>}

                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Street"
                    value={street}
                    onChange={(e) => {
                        setStreet(e.target.value);
                        setStreetValid(validateStreet(e.target.value));
                    }}
                    className="!mb-4"
                />
                {!streetValid && <div className="text-red-500 text-sm mb-2">Street is required.</div>}

                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        setPhoneNumberValid(validatePhoneNumber(e.target.value));
                    }}
                    placeholder="044/45/48 XXXXXX"
                    className="!mb-4"
                />
                {!phoneNumberValid && <div className="text-red-500 text-sm mb-2">Phone number format is invalid. (Format: XXX/XX/XX XXXXXX)</div>}

                <Autocomplete
                    id="country-autocomplete"
                    options={countries.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                    groupBy={(option) => option.firstLetter}
                    getOptionLabel={(option) => option.name}
                    value={country}
                    onChange={handleCountryChange}
                    PaperComponent={CustomPaper}
                    fullWidth
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
                    className="w-full"
                >
                    Add
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddAddressModal;