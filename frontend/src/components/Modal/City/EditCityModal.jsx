import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ActionButtons, CustomBox, CustomModal, CustomPaper, CustomTextField, CustomTypography, DashboardCountryFlag, handleApiError } from '../../../assets/CustomComponents';
import { editCityService } from '../../../services/cityService';
import { getCountriesService } from '../../../services/countryService';
import { CityValidations } from '../../../utils/validations/city';

const EditCityModal = ({ open, onClose, city, onViewDetails, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [country, setCountry] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [countriesWithGroups, setCountriesWithGroups] = useState([]);
    const [loading, setLoading] = useState(false);

    const validateName = (v) => CityValidations.nameRules.pattern.test(v);
    const validateZipCode = (v) => CityValidations.zipCodeRules.pattern.test(v);

    const isFormValid = validateName(name) && country && validateZipCode(zipCode);

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

                <CustomTextField
                    label="Name"
                    value={name}
                    setValue={setName}
                    validate={validateName}
                    validationRule={CityValidations.nameRules}
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

                <CustomTextField
                    label="Zip Code"
                    value={zipCode}
                    setValue={setZipCode}
                    validate={validateZipCode}
                    validationRule={CityValidations.zipCodeRules}
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
                        disabled: !isFormValid || loading
                    }}
                    loading={loading}
                />
            </CustomBox>
        </CustomModal>
    );
};

export default EditCityModal;
