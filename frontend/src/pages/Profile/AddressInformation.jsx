import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { SectionHeader } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar/Navbar';
import { AuthContext } from '../../context/AuthContext';
import ProfileSidebar from './ProfileSidebar';

const AddressInformation = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const [name, setName] = useState(auth.address?.name || '');
    const [street, setStreet] = useState(auth.address?.street || '');
    const [phoneNumber, setPhoneNumber] = useState(auth.address?.phoneNumber || '');
    const [city, setCity] = useState(auth.address?.city?._id || auth.address?.city || '');
    const [country, setCountry] = useState(auth.address?.country?._id || auth.address?.country || '');
    const [existingAddress, setExistingAddress] = useState(auth.address || null);
    const [cities, setCities] = useState([]);
    const [countries, setCountries] = useState([]);

    const axiosInstance = useAxios();

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axiosInstance.get('/countries/get');
                if (response.data && Array.isArray(response.data)) {
                    setCountries(response.data);
                } else {
                    console.error('Unexpected data structure for countries:', response.data);
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
                    } else {
                        console.error('Unexpected data structure for cities:', response.data);
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

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        if (!name || !street || !phoneNumber || !city || !country) {
            toast.error('Please fill in all the fields');
            return;
        }

        const updatedAddress = {
            name,
            street,
            phoneNumber,
            city,
            country
        };

        try {
            let response;
            if (existingAddress && existingAddress._id) {
                response = await axiosInstance.put(`/addresses/update/${existingAddress._id}`, updatedAddress);
            } else {
                response = await axiosInstance.post('/addresses/create', updatedAddress);
            }

            if (response.status === 200 || response.status === 201) {
                toast.success(existingAddress ? 'Address updated successfully' : 'Address added successfully');
                setExistingAddress(response.data);

                const newAuth = {
                    ...auth,
                    address: response.data
                };
                setAuth(newAuth);
                localStorage.setItem('address', JSON.stringify(response.data));
            } else {
                toast.error('Unexpected response from server');
            }
        } catch (error) {
            console.error('Error saving address:', error);
            if (error.response) {
                toast.error(error.response.data.message || 'Error saving address');
            } else {
                toast.error('Error saving address');
            }
        }
    };

    return (
        <>
            <Navbar />
            <Box className="container mx-auto max-w-4xl flex mb-16">
                <ProfileSidebar />
                <main className="p-4 relative left-32 w-full">
                    <div className="container mx-auto mt-20 mb-20">
                        <SectionHeader title='Address' />

                        <div className="bg-white shadow-sm rounded-sm p-8">
                            <form onSubmit={handleSaveAddress} className="space-y-6">
                                <Box className="flex gap-4">
                                    <TextField
                                        fullWidth
                                        label="Name"
                                        variant="outlined"
                                        name="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        InputLabelProps={{ className: 'text-gray-700' }}
                                        InputProps={{ className: 'text-gray-700' }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Street"
                                        variant="outlined"
                                        name="street"
                                        value={street}
                                        onChange={(e) => setStreet(e.target.value)}
                                        InputLabelProps={{ className: 'text-gray-700' }}
                                        InputProps={{ className: 'text-gray-700' }}
                                    />
                                </Box>

                                <Box className="flex gap-4">

                                    <TextField
                                        fullWidth
                                        label="Phone Number"
                                        variant="outlined"
                                        name="phoneNumber"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        InputLabelProps={{ className: 'text-gray-700' }}
                                        InputProps={{ className: 'text-gray-700' }}
                                        placeholder="044/45/48 XXXXXX"
                                    />
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>Country</InputLabel>
                                        <Select
                                            name="country"
                                            value={country || ''}
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

                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel>City</InputLabel>
                                        <Select
                                            name="city"
                                            value={city || ''}
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
                                </Box >

                                <Button type="submit" variant="contained" color="primary" className="bg-orange-600 hover:bg-orange-700">
                                    Save
                                </Button>
                            </form>
                        </div>
                    </div>
                </main>
            </Box>
            <Footer />
        </>
    );
};

export default AddressInformation;