import { Autocomplete, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, CustomBox, CustomModal, CustomPaper, CustomTextField, CustomTypography, DashboardCountryFlag, handleApiError, LoadingLabel } from '../../../assets/CustomComponents';
import { addCityService } from '../../../services/cityService';
import { getCountriesService } from '../../../services/countryService';
import { CityValidations } from '../../../utils/validations/city';

const AddCityModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [country, setCountry] = useState(null);
    const [zipCode, setZipCode] = useState('');
    const [countriesWithGroups, setCountriesWithGroups] = useState([]);
    const [loading, setLoading] = useState(false);

    const validateName = (v) => CityValidations.nameRules.pattern.test(v);
    const validateZipCode = (v) => CityValidations.zipCodeRules.pattern.test(v);

    const isFormValid = validateName(name) && country && validateZipCode(zipCode);

    useEffect(() => {
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
    }, []);

    const handleAddCity = async () => {
        setLoading(true);

        if (!name || !country || !zipCode) {
            toast.error('Please fill in all the fields');
            return;
        }

        const data = {
            name,
            country: country._id,
            zipCode
        }

        try {
            const response = await addCityService(data);
            toast.success(response.data.message);
            onAddSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error adding city');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <div style={{ width: '400px' }}>
                <CustomBox>
                    <CustomTypography variant="h5">Add City</CustomTypography>

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
                        value={country}
                        onChange={(event, newValue) => setCountry(newValue)}
                        PaperComponent={CustomPaper}
                        fullWidth
                        renderOption={(props, option) => (
                            <li {...props} style={{ display: 'flex', alignItems: 'center' }}>
                                <DashboardCountryFlag countryCode={option.countryCode} />
                                {option.name}
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

                    <BrownButton
                        onClick={handleAddCity}
                        variant="contained"
                        color="primary"
                        disabled={!isFormValid || loading}
                        className="w-full"
                    >
                        <LoadingLabel loading={loading} />
                    </BrownButton>
                </CustomBox>
            </div>
        </CustomModal>
    );
};

export default AddCityModal;