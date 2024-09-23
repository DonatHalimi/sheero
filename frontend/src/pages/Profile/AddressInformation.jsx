import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AddressInformationSkeleton, Header } from '../../assets/CustomComponents';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar/Navbar';
import { AuthContext } from '../../context/AuthContext';
import ProfileSidebar from './ProfileSidebar';
import useAxios from '../../axiosInstance';

const apiUrl = 'http://localhost:5000/api/addresses';

const AddressInformation = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const userId = auth?.userId;
    const axiosInstance = useAxios();

    const [name, setName] = useState('');
    const [street, setStreet] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [existingAddress, setExistingAddress] = useState(null);
    const [cities, setCities] = useState([]);
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId && auth.accessToken) {
            fetchAddress();
        }
    }, [userId, auth.accessToken]);

    const fetchAddress = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`${apiUrl}/user/${userId}`);
            const address = response.data;
            if (address) {
                setName(address.name || '');
                setStreet(address.street || '');
                setPhoneNumber(address.phoneNumber || '');
                setCity(address.city?._id || '');
                setCountry(address.country?._id || '');
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
            country,
        };

        try {
            let response;
            if (existingAddress) {
                response = await axiosInstance.put(`${apiUrl}/update/${existingAddress._id}`, updatedAddress);
            } else {
                response = await axiosInstance.post(`${apiUrl}/create`, updatedAddress);
            }

            if (response.status === 200 || response.status === 201) {
                toast.success(existingAddress ? 'Address updated successfully' : 'Address added successfully');
                setExistingAddress(response.data);
            } else {
                toast.error('Unexpected response from server');
            }
        } catch (error) {
            console.error('Error saving address:', error.message);
            toast.error('Error saving address');
        }
    };

    return (
        <>
            <Navbar />
            <Box className="container mx-auto max-w-4xl flex mb-16">
                <ProfileSidebar />
                <main className="p-4 relative left-32 w-full">
                    <div className="container mx-auto mt-20 mb-20">
                        <Header title="Address" />
                        <div className="bg-white shadow-sm rounded-sm p-8">
                            {loading ? (
                                <AddressInformationSkeleton />
                            ) : (
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
                                </Box>

                                <Button type="submit" variant="contained" color="primary" className="bg-orange-600 hover:bg-orange-700">
                                    Save
                                </Button>
                            </form>
                            )}
                        </div>
                    </div>
                </main>
            </Box>
            <Footer />
        </>
    );
};

export default AddressInformation;