import { InputLabel, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError, OutlinedBrownFormControl } from '../../../assets/CustomComponents';
import useAxios from '../../../utils/axiosInstance';

const EditCityModal = ({ open, onClose, city, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [isValidName, setIsValidName] = useState(true);
    const [country, setCountry] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [isValidZipCode, setIsValidZipCode] = useState(true);
    const [countries, setCountries] = useState([]);

    const axiosInstance = useAxios();

    const validateName = (v) => /^[A-Z][a-zA-Z\s]{2,15}$/.test(v);
    const validateZipCode = (v) => /^[0-9]{4,5}$/.test(v);

    const isValidForm = isValidName && country && isValidZipCode;

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
        const updatedData = {
            name,
            country,
            zipCode
        }

        try {
            const response = await axiosInstance.put(`/cities/update/${city._id}`, updatedData);
            toast.success(response.data.message);
            onEditSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error updating city');
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit City</CustomTypography>

                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                        setIsValidName(validateName(e.target.value));
                    }}
                    error={!isValidName}
                    helperText={!isValidName ? 'Name must start with a capital letter and be 3-15 characters long' : ''}
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
                    onChange={(e) => {
                        setZipCode(e.target.value);
                        setIsValidZipCode(validateZipCode(e.target.value));
                    }}
                    error={!isValidZipCode}
                    helperText={!isValidZipCode ? 'Zip code must be 4-5 digits long' : ''}
                    className="!mb-4"
                />
                <BrownButton
                    onClick={handleEditCity}
                    variant="contained"
                    color="primary"
                    disabled={!isValidForm}
                    className="w-full"
                >
                    Save
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default EditCityModal;
