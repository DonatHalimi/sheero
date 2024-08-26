import { Autocomplete, TextField } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomPaper, CustomTypography } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';

const AddCityModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [country, setCountry] = useState(null);
    const [zipCode, setZipCode] = useState('');
    const [countries, setCountries] = useState([]);

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

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
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Add City</CustomTypography>

                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="!mb-4"
                />
                <Autocomplete
                    id="country-autocomplete"
                    options={countries.sort((a, b) => -b.firstLetter.localeCompare(a.firstLetter))}
                    groupBy={(option) => option.firstLetter}
                    getOptionLabel={(option) => option.name}
                    value={country}
                    onChange={(event, newValue) => setCountry(newValue)}
                    PaperComponent={CustomPaper}
                    fullWidth
                    renderInput={(params) => <TextField {...params} label="Country" variant="outlined" />}
                    className='!mb-4'
                />
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
            </CustomBox>
        </CustomModal>
    );
};

export default AddCityModal;