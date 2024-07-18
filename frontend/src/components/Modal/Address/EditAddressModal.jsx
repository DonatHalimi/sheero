import { Box, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';
import { BrownButton, BrownOutlinedTextField, OutlinedBrownFormControl } from '../../Dashboard/CustomComponents';

const EditAddressModal = ({ open, onClose, address, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [cities, setCities] = useState([]);
    const [countries, setCountries] = useState([]);

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        if (address) {
            setName(address.name);
            setStreet(address.street);
            setCity(address.city._id);
            setCountry(address.country._id);
        }

        const fetchCountriesAndCities = async () => {
            try {
                const countriesResponse = await axiosInstance.get('/countries/get');
                const citiesResponse = await axiosInstance.get('/cities/get');
                setCountries(countriesResponse.data);
                setCities(citiesResponse.data)
            } catch (error) {
                console.error('Error fetching countries', error);
            }
        };

        fetchCountriesAndCities();
    }, [address]);

    const handleEditAddress = async () => {
        const updates = {};
        if (name !== address.name) updates.name = name;
        if (street !== address.street) updates.street = street;
        if (city !== address.city._id) updates.city = city;
        if (country !== address.country._id) updates.country = country;

        try {
            const response = await axiosInstance.put(`/addresses/update/${address._id}`, updates);
            toast.success('Address updated successfully');
            onEditSuccess(response.data);
            onClose();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                console.error('Error updating address:', error.response.data);
                toast.error('Error updating address: ' + error.response.data.message);
            } else {
                console.error('Error updating address:', error.message);
                toast.error('Error updating address');
            }
        }
    };

    return (
        <Modal open={open} onClose={onClose} className='flex items-center justify-center'>
            <Box className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
                <Typography variant='h5' className="!text-xl !font-bold !mb-4">Edit Address</Typography>
                <BrownOutlinedTextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    margin="normal"
                    className='mb-4'
                />

                <BrownOutlinedTextField
                    label="Street"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    fullWidth
                    margin="normal"
                    className='mb-4'
                />

                <OutlinedBrownFormControl fullWidth margin="normal">
                    <InputLabel>Country</InputLabel>
                    <Select
                        label='Country'
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
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
                    onClick={handleEditAddress}
                    variant="contained"
                    color="primary"
                    fullWidth
                >
                    Update
                </BrownButton>
            </Box>
        </Modal>
    );
};

export default EditAddressModal;
