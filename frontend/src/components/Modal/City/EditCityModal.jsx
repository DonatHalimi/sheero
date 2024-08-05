import { Box, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, OutlinedBrownFormControl } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';

const EditCityModal = ({ open, onClose, city, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [countries, setCountries] = useState([]);

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        if (city) {
            setName(city.name);
            setCountry(city.country._id);
            setZipCode(city.zipCode);
        }

        const fetchCountries = async () => {
            try {
                const response = await axiosInstance.get('/countries/get');
                setCountries(response.data);
            } catch (error) {
                console.error('Error fetching countries', error);
            }
        };

        fetchCountries();
    }, [city]);

    const handleEditCity = async () => {
        if (!name || !country || !zipCode) {
            toast.error('Please fill in all the fields', {
                closeOnClick: true
            });
            return;
        }

        try {
            await axiosInstance.put(`/cities/update/${city._id}`, { name, country, zipCode });
            toast.success('City updated successfully');
            onEditSuccess();
            onClose();
        } catch (error) {
            toast.error('Error updating city');
            console.error('Error updating city', error);
        }
    };

    return (
        <Modal open={open} onClose={onClose} className="flex items-center justify-center">
            <Box className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
                <Typography variant='h5' className="!text-xl !font-bold !mb-6">Edit City</Typography>
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
                    onClick={handleEditCity}
                    variant="contained"
                    color="primary"
                    className="w-full"
                >
                    Save
                </BrownButton>
            </Box>
        </Modal>
    );
};

export default EditCityModal;
