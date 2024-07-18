import { Box, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';
import { BrownButton, BrownOutlinedTextField, OutlinedBrownFormControl } from '../../Dashboard/CustomComponents';

const AddCityModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [zipCode, setZipCode] = useState('');
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
    }, []);

    const handleAddCity = async () => {
        if (!name || !country || !zipCode) {
            toast.error('Please fill in all the fields', {
                closeOnClick: true
            });
            return;
        }

        try {
            await axiosInstance.post('/cities/create', { name, country, zipCode });
            toast.success('City added successfully');
            onAddSuccess();
            onClose();
        } catch (error) {
            toast.error('Error adding city');
            console.error('Error adding city', error);
        }
    };

    return (
        <Modal open={open} onClose={onClose} className="flex items-center justify-center">
            <Box className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
                <Typography variant='h5' className="!text-xl !font-bold !mb-6">Add City</Typography>
                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="!mb-4"
                />
                <OutlinedBrownFormControl fullWidth className="!mb-4">
                    <InputLabel>Country</InputLabel>
                    <Select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        label="Country"
                    >
                        {countries.map((country) => (
                            <MenuItem key={country._id} value={country._id}>
                                {country.name}
                            </MenuItem>
                        ))}
                    </Select>
                </OutlinedBrownFormControl>
                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Zip Code"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="!mb-4"
                />
                <BrownButton
                    onClick={handleAddCity}
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

export default AddCityModal;
