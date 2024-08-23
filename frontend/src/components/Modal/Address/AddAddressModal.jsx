import { Autocomplete, Box, Modal, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomPaper } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';

const AddAddressModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState(null);
    const [country, setCountry] = useState(null);
    const [cities, setCities] = useState([]);
    const [countries, setCountries] = useState([]);

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

    const handleAddAddress = async () => {
        if (!name || !street || !city || !country) {
            toast.error('Please fill in all the fields', { closeOnClick: true });
            return;
        }

        try {
            await axiosInstance.post('/addresses/create', { name, street, city: city._id, country: country._id });
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
            </Box>
        </Modal>
    );
};

export default AddAddressModal;
