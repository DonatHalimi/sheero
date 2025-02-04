import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ActionButtons, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError } from '../../../assets/CustomComponents';
import { editCountryService } from '../../../services/countryService';

const EditCountryModal = ({ open, onClose, country, onViewDetails, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [isValidName, setIsValidName] = useState(true);
    const [countryCode, setCountryCode] = useState('');
    const [isValidCode, setIsValidCode] = useState(true);

    const validateName = (v) => /^[A-ZÇ][a-zA-ZëËçÇ\s]{3,35}$/.test(v);
    const validateCountryCode = (v) => /^[A-Z]{2,3}$/.test(v);

    const isValidForm = isValidName && isValidCode;

    useEffect(() => {
        if (country) {
            setName(country.name);
            setCountryCode(country.countryCode || '');
        }
    }, [country]);

    const handleEditCountry = async () => {
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
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit Country</CustomTypography>

                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Name"
                    value={name}
                    onChange={(e) => {
                        setName(e.target.value)
                        setIsValidName(validateName(e.target.value))
                    }}
                    error={!isValidName}
                    helperText={!isValidName ? 'Name must start with a capital letter and be 3-35 characters long' : ''}
                    className="!mb-4"
                />

                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Country Code"
                    value={countryCode}
                    onChange={(e) => {
                        setCountryCode(e.target.value);
                        setIsValidCode(validateCountryCode(e.target.value));
                    }}
                    error={!isValidCode}
                    helperText={!isValidCode ? 'Country Code must be capitalized and 2-3 capital letters' : ''}
                    className='!mb-4'
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
                        disabled: !isValidForm
                    }}
                />
            </CustomBox>
        </CustomModal>
    );
};

export default EditCountryModal;
