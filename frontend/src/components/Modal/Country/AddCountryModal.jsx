import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, CustomBox, CustomModal, CustomTextField, CustomTypography, handleApiError, LoadingLabel } from '../../../assets/CustomComponents';
import { addCountryService } from '../../../services/countryService';
import { CountryValidations } from '../../../utils/validations/country';

const AddCountryModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [countryCode, setCountryCode] = useState('');
    const [loading, setLoading] = useState(false);

    const validateName = (v) => CountryValidations.nameRules.pattern.test(v);
    const validateCountryCode = (v) => CountryValidations.countryCodeRules.pattern.test(v);

    const isFormValid = validateName(name) && validateCountryCode(countryCode) && name && countryCode;

    const handleAddCountry = async () => {
        setLoading(true);
        if (!name || !countryCode) {
            toast.error('Please fill in all required fields');
            return;
        }

        const data = {
            name,
            countryCode,
        }

        try {
            const response = await addCountryService(data);
            toast.success(response.data.message);
            onAddSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error adding country');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Add Country</CustomTypography>

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

                <BrownButton
                    onClick={handleAddCountry}
                    variant="contained"
                    color="primary"
                    disabled={!isFormValid || loading}
                    className="w-full"
                >
                    <LoadingLabel loading={loading} />
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddCountryModal;
