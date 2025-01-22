import { InputLabel, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError, OutlinedBrownFormControl } from '../../../assets/CustomComponents';
import useAxios from '../../../utils/axiosInstance';

const EditAddressModal = ({ open, onClose, address, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [isValidName, setIsValidName] = useState(true);
    const [street, setStreet] = useState('');
    const [isValidStreet, setIsValidStreet] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);
    const [comment, setComment] = useState('');
    const [isValidComment, setIsValidComment] = useState(true);
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [cities, setCities] = useState([]);
    const [countries, setCountries] = useState([]);

    const axiosInstance = useAxios();

    const validateName = (v) => /^[A-Z][a-zA-Z]{2,10}$/.test(v);
    const validatePhoneNumber = (v) => /^0(44|45|48|49)\d{6}$/.test(v);
    const validateStreet = (v) => /^[A-Z][a-zA-Z0-9\s]{2,27}$/.test(v);
    const validateComment = (v) => !v || /^[a-zA-Z0-9\s]{2,25}$/.test(v);

    const isValidForm =
        isValidName &&
        isValidStreet &&
        isValidPhoneNumber &&
        isValidComment &&
        city &&
        country;

    useEffect(() => {
        if (address) {
            setName(address.name);
            setStreet(address.street);
            setPhoneNumber(address.phoneNumber);
            setComment(address.comment);
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
        const updatedData = {
            name,
            street,
            phoneNumber,
            comment: comment || null,
            city,
            country
        };

        try {
            const response = await axiosInstance.put(`/addresses/update/${address._id}`, updatedData);
            toast.success(response.data.message);
            onEditSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error updating address');
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit Address</CustomTypography>

                <BrownOutlinedTextField
                    label="Name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                        setIsValidName(validateName(e.target.value));
                    }}
                    error={!isValidName}
                    helperText={!isValidName ? 'Name must start with a capital letter and be 2-10 characters long' : ''}
                    fullWidth
                    margin="normal"
                    className='mb-4'
                />

                <BrownOutlinedTextField
                    label="Street"
                    value={street}
                    onChange={(e) => {
                        setStreet(e.target.value)
                        setIsValidStreet(validateStreet(e.target.value));
                    }}
                    fullWidth
                    margin="normal"
                    error={!isValidStreet}
                    helperText={!isValidStreet ? 'Street must start with a capital letter and be 2-27 characters long' : ''}
                    className='mb-4'
                />

                <BrownOutlinedTextField
                    label="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => {
                        setPhoneNumber(e.target.value)
                        setIsValidPhoneNumber(validatePhoneNumber(e.target.value));
                    }}
                    fullWidth
                    margin="normal"
                    placeholder="044/45/48 XXXXXX"
                    error={!isValidPhoneNumber}
                    helperText={!isValidPhoneNumber ? 'Phone number must start with 044, 045, 048 or 049 followed by 6 digits' : ''}
                    className='mb-4'
                />

                <BrownOutlinedTextField
                    label="Comment"
                    value={comment}
                    onChange={(e) => {
                        setComment(e.target.value)
                        setIsValidComment(validateComment(e.target.value));
                    }}
                    fullWidth
                    margin="normal"
                    error={!isValidComment}
                    helperText={!isValidComment ? 'Comment must be 2-25 characters long' : ''}
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
                    disabled={!isValidForm}
                >
                    Update
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default EditAddressModal;