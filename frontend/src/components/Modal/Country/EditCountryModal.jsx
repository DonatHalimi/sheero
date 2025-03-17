import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ActionButtons, CustomBox, CustomModal, CustomTextField, CustomTypography, handleApiError } from '../../../assets/CustomComponents';
import { editCountryService } from '../../../services/countryService';
import { CountryValidations } from '../../../utils/validations/country';

const EditCountryModal = ({ open, onClose, country, onViewDetails, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [loading, setLoading] = useState(false);

    const validateName = (v) => CountryValidations.nameRules.pattern.test(v);
    const validateCountryCode = (v) => CountryValidations.countryCodeRules.pattern.test(v);

    const isFormValid = validateName(name) && validateCountryCode(countryCode);

    useEffect(() => {
        if (country) {
            setName(country.name);
            setCountryCode(country.countryCode || '');
        }
    }, [country]);

    const handleEditCountry = async () => {
        setLoading(true);

        if (!name || !countryCode) {
            toast.error('Please fill in all required fields');
            return;
        }

        const updatedData = {
            name,
            countryCode,
        }

        try {
            const response = await editCountryService(country._id, updatedData);
            toast.success(response.data.message);
            onEditSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error updating country');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit Country</CustomTypography>

                <CustomTextField
                    label="Name"
                    value={name}
                    setValue={setName}
                    validate={validateName}
                    validationRule={CountryValidations.nameRules}
                />

                <CustomTextField
                    label="Country Code"
                    value={countryCode}
                    setValue={setCountryCode}
                    validate={validateCountryCode}
                    validationRule={CountryValidations.countryCodeRules}
                />

                <ActionButtons
                    primaryButtonLabel="Save"
                    secondaryButtonLabel="View Details"
                    onPrimaryClick={handleEditCountry}
                    onSecondaryClick={() => {
                        onViewDetails(country);
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

export default EditCountryModal;
