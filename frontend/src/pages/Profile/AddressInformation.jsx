import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Header, InformationSkeleton, ProfileLayout } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar/Navbar';

const AddressInformation = () => {
    const axiosInstance = useMemo(() => useAxios(), []);

    const [name, setName] = useState('');
    const [street, setStreet] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [comment, setComment] = useState('');
    const [existingAddress, setExistingAddress] = useState(null);
    const [cities, setCities] = useState([]);
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);

    const [nameValid, setNameValid] = useState(true);
    const [streetValid, setStreetValid] = useState(true);
    const [phoneNumberValid, setPhoneNumberValid] = useState(true);
    const [focusedField, setFocusedField] = useState(null);

    useEffect(() => window.scrollTo(0, 0), []);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axiosInstance.get('/auth/me');
                const userId = response.data.id;
                fetchAddress(userId);
            } catch (error) {
                console.error('Error fetching user data:', error.message);
            }
        };

        fetchUserData();
    }, [axiosInstance]);

    const fetchAddress = async (userId) => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/addresses/user/${userId}`);
            const address = response.data;
            if (address) {
                setName(address.name || '');
                setStreet(address.street || '');
                setPhoneNumber(address.phoneNumber || '');
                setCity(address.city?._id || '');
                setCountry(address.country?._id || '');
                setComment(address.comment || '');
                setExistingAddress(address);
            }
        } catch (error) {
            console.error('Error fetching address:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axiosInstance.get('/countries/get');
                if (response.data && Array.isArray(response.data)) {
                    setCountries(response.data);
                }
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };

        fetchCountries();
    }, [axiosInstance]);

    useEffect(() => {
        if (country && !cities.length) {
            const fetchCities = async () => {
                try {
                    const response = await axiosInstance.get(`/cities/country/${country}`);
                    if (response.data && Array.isArray(response.data)) {
                        setCities(response.data);
                    }
                } catch (error) {
                    console.error('Error fetching cities:', error);
                }
            };

            fetchCities();
        }
    }, [country, cities.length, axiosInstance]);

    const handleCountryChange = (e) => {
        const selectedCountryId = e.target.value;
        setCountry(selectedCountryId);
        setCity('');
        setCities([]);
    };

    const handleCityChange = (e) => {
        const selectedCityId = e.target.value;
        setCity(selectedCityId);
    };

    const validateName = (name) => /^[A-Z][a-zA-Z]{1,9}$/.test(name);
    const validateStreet = (street) => /^[A-Z][a-zA-Z0-9]*([ ]+[A-Z][a-zA-Z0-9]*)*$/.test(street);
    const validatePhoneNumber = (phoneNumber) => /^0(44|45|48)\d{6}$/.test(phoneNumber);

    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value);
        setNameValid(validateName(value));
    };

    const handleStreetChange = (e) => {
        const value = e.target.value;
        setStreet(value);
        setStreetValid(validateStreet(value));
    };

    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;
        setPhoneNumber(value);
        setPhoneNumberValid(validatePhoneNumber(value));
    };

    const handleCommentChange = (e) => setComment(e.target.value);

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        if (!validateName(name) || !validateStreet(street) || !validatePhoneNumber(phoneNumber) || !city || !country) {
            toast.error('Please fill in all the fields correctly');
            setNameValid(validateName(name));
            setStreetValid(validateStreet(street));
            setPhoneNumberValid(validatePhoneNumber(phoneNumber));
            return;
        }

        const updatedAddress = {
            name,
            street,
            phoneNumber,
            city,
            country,
            comment,
        };

        try {
            let response;
            if (existingAddress) {
                response = await axiosInstance.put(`/addresses/update/${existingAddress._id}`, updatedAddress);
            } else {
                response = await axiosInstance.post(`/addresses/create`, updatedAddress);
            }

            if (response.status === 200 || response.status === 201) {
                toast.success(existingAddress ? 'Address updated successfully' : 'Address added successfully');
                setExistingAddress(response.data);
            } else {
                toast.error('Unexpected response from server');
            }
        } catch (error) {
            toast.error('Error saving address');
        }
    };

    const isFormUnchanged = existingAddress &&
        name === existingAddress.name &&
        street === existingAddress.street &&
        phoneNumber === existingAddress.phoneNumber &&
        city === existingAddress.city?._id &&
        country === existingAddress.country?._id &&
        comment === existingAddress.comment;

    return (
        <>
            <Navbar />
            <ProfileLayout>
                <Header title="Address" />

                <Box className='bg-white rounded shadow-sm'
                    sx={{
                        p: { xs: 3, md: 3 }
                    }}
                >
                    {loading ? (
                        <InformationSkeleton showAdditionalField={true} />
                    ) : (
                        <form onSubmit={handleSaveAddress} className="space-y-5">
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 2 } }}>
                                <div className="relative w-full">
                                    <TextField
                                        fullWidth
                                        label="Name"
                                        variant="outlined"
                                        required
                                        name="name"
                                        value={name}
                                        onChange={handleNameChange}
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField(null)}
                                        error={!nameValid}
                                        InputLabelProps={{ className: 'text-gray-700' }}
                                        InputProps={{ className: 'text-gray-700' }}
                                    />
                                    {focusedField === 'name' && !nameValid && (
                                        <div className="absolute left-0 bottom-[-78px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10">
                                            <span className="block text-xs font-semibold mb-1">Invalid Name</span>
                                            Must start with a capital letter, 2-10 characters.
                                            <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
                                        </div>
                                    )}
                                </div>
                                <div className="relative w-full">
                                    <TextField
                                        fullWidth
                                        label="Street"
                                        variant="outlined"
                                        required
                                        name="street"
                                        value={street}
                                        onChange={handleStreetChange}
                                        onFocus={() => setFocusedField('street')}
                                        onBlur={() => setFocusedField(null)}
                                        error={!streetValid}
                                        InputLabelProps={{ className: 'text-gray-700' }}
                                        InputProps={{ className: 'text-gray-700' }}
                                    />
                                    {focusedField === 'street' && !streetValid && (
                                        <div className="absolute left-0 bottom-[-58px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10">
                                            <span className="block text-xs font-semibold mb-1">Invalid Street</span>
                                            Must start with a capital letter.
                                            <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
                                        </div>
                                    )}
                                </div>

                                <div className="relative w-full">
                                    <TextField
                                        fullWidth
                                        label="Phone Number"
                                        variant="outlined"
                                        required
                                        name="phoneNumber"
                                        value={phoneNumber}
                                        onChange={handlePhoneNumberChange}
                                        onFocus={() => setFocusedField('phoneNumber')}
                                        onBlur={() => setFocusedField(null)}
                                        error={!phoneNumberValid}
                                        InputLabelProps={{ className: 'text-gray-700' }}
                                        InputProps={{ className: 'text-gray-700' }}
                                        placeholder="044/45/48 XXXXXX"
                                    />
                                    {focusedField === 'phoneNumber' && !phoneNumberValid && (
                                        <div className="absolute left-0 bottom-[-78px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10">
                                            <span className="block text-xs font-semibold mb-1">Invalid Phone Number</span>
                                            Must be in the format: 044/45/48 followed by 6 digits.
                                            <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
                                        </div>
                                    )}
                                </div>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 2 } }}>
                                <FormControl fullWidth variant="outlined" required>
                                    <InputLabel>Country</InputLabel>
                                    <Select
                                        name="country"
                                        value={country}
                                        onChange={handleCountryChange}
                                        label="Country"
                                    >
                                        {countries.map((country) => (
                                            <MenuItem key={country._id} value={country._id}>
                                                {country.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth variant="outlined" required>
                                    <InputLabel>City</InputLabel>
                                    <Select
                                        name="city"
                                        value={city}
                                        onChange={handleCityChange}
                                        label="City"
                                        disabled={!country}
                                    >
                                        {cities.map((city) => (
                                            <MenuItem key={city._id} value={city._id}>
                                                {city.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            <TextField
                                fullWidth
                                label="Comment"
                                variant="outlined"
                                name="comment"
                                value={comment}
                                onChange={handleCommentChange}
                                placeholder="Add any additional comments (optional)"
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isFormUnchanged}
                                className='relative bottom-2'
                            >
                                {existingAddress ? 'Update' : 'Add'}
                            </Button>
                        </form>
                    )}
                </Box >
            </ProfileLayout>
            <Footer />
        </>
    );
};

export default AddressInformation;
