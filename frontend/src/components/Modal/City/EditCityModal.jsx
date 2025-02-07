import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ActionButtons, BrownOutlinedTextField, CustomBox, CustomModal, CustomPaper, CustomTypography, DashboardCountryFlag, handleApiError } from '../../../assets/CustomComponents';
import { editCityService } from '../../../services/cityService';
import { getCountriesService } from '../../../services/countryService';

const EditCityModal = ({ open, onClose, city, onViewDetails, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [isValidName, setIsValidName] = useState(true);
    const [country, setCountry] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [isValidZipCode, setIsValidZipCode] = useState(true);
    const [countriesWithGroups, setCountriesWithGroups] = useState([]);
    const [loading, setLoading] = useState(false);

    const validateName = (v) => /^[A-ZÇ][a-zA-ZëËçÇ\s]{2,15}$/.test(v);
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
                const response = await getCountriesService();
                const countriesWithGroups = response.data.map(country => ({
                    ...country,
                    firstLetter: country.name[0].toUpperCase()
                }));
                setCountriesWithGroups(countriesWithGroups);
            } catch (error) {
                console.error('Error fetching countries', error);
            }
        };

        fetchCountries();
    }, [city]);

    const handleEditCity = async () => {
        setLoading(true);

        const updatedData = {
            name,
            country,
            zipCode
        }

        try {
            const response = await editCityService(city._id, updatedData);
            toast.success(response.data.message);
            onEditSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error updating city');
        } finally {
            setLoading(false);
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

                <Autocomplete
                    id="country-autocomplete"
                    options={countriesWithGroups}
                    groupBy={(option) => option.firstLetter}
                    getOptionLabel={(option) => option.name}
                    value={countriesWithGroups.find(c => c._id === country) || null}
                    onChange={(event, newValue) => setCountry(newValue ? newValue._id : '')}
                    PaperComponent={CustomPaper}
                    fullWidth
                    renderOption={(props, option) => (
                        <li {...props} style={{ display: 'flex', alignItems: 'center' }}>
                            <DashboardCountryFlag countryCode={option.countryCode} name={option.name} />
                        </li>
                    )}
                    renderInput={(params) => <TextField {...params} label="Country" variant="outlined" />}
                    className='!mb-4'
                />

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

                <ActionButtons
                    primaryButtonLabel="Save"
                    secondaryButtonLabel="View Details"
                    onPrimaryClick={handleEditCity}
                    onSecondaryClick={() => {
                        onViewDetails(city);
                        onClose();
                    }}
                    primaryButtonProps={{
                        disabled: !isValidForm || loading
                    }}
                    loading={loading}
                />
            </CustomBox>
        </CustomModal>
    );
};

export default EditCityModal;
