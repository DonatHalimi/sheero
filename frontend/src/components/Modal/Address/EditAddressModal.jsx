import { InputLabel, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, OutlinedBrownFormControl } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';

const EditAddressModal = ({ open, onClose, address, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [cities, setCities] = useState([]);
    const [countries, setCountries] = useState([]);

    const axiosInstance = useAxios();

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
            } else {
                console.error('Error updating address:', error.message);
                toast.error('Error updating address');
            }
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit Address</CustomTypography>

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
            </CustomBox>
        </CustomModal>
    );
};

export default EditAddressModal;
