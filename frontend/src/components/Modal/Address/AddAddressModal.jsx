import { Box, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, OutlinedBrownFormControl } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';

const AddAddressModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [cities, setCities] = useState([]);
    const [countries, setCountries] = useState([]);

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axiosInstance.get('/countries/get');
                setCountries(response.data);
            } catch (error) {
                console.error('Error fetching countries', error);
            }
        };

        fetchCountries();
    }, [axiosInstance]);

    const handleCountryChange = async (e) => {
        const selectedCountry = e.target.value;
        setCountry(selectedCountry);
        setCity('');
        try {
            const response = await axiosInstance.get(`/cities/country/${selectedCountry}`);
            setCities(response.data);
        } catch (error) {
            console.error('Error fetching cities for selected country', error);
        }
    };

    const handleAddAddress = async () => {
        if (!name || !street || !city || !country) {
            toast.error('Please fill in all the fields', {
                closeOnClick: true
            });
            return;
        }

        try {
            await axiosInstance.post('/addresses/create', { name, street, city, country });
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
        <Modal open={open} onClose={onClose} className="flex items-center justify-center">
            <Box className="bg-white p-4 rounded-lg shadow-lg max-w-md">
                <Typography variant='h5' className="!text-xl !font-bold !mb-4">Add Address</Typography>

                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="!mb-4"
                />

                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="!mb-2"
                />

                <OutlinedBrownFormControl fullWidth margin="normal">
                    <InputLabel>Country</InputLabel>
                    <Select
                        label='Country'
                        value={country}
                        onChange={handleCountryChange}
                    >
                        {countries.map((country) => (
                            <MenuItem key={country._id} value={country._id}>{country.name}</MenuItem>
                        ))}
                    </Select>
                </OutlinedBrownFormControl>

                <OutlinedBrownFormControl fullWidth margin="normal">
                    <InputLabel>City</InputLabel>
                    <Select
                        label='City'
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className='mb-4'
                    >
                        {cities.map((city) => (
                            <MenuItem key={city._id} value={city._id}>{city.name}</MenuItem>
                        ))}
                    </Select>
                </OutlinedBrownFormControl>

                <BrownButton
                    onClick={handleAddAddress}
                    variant="contained"
                    color="primary"
                    className="w-full"
                >
                    Add
                </BrownButton>
            </Box>
        </Modal>
    );
};

export default AddAddressModal;
