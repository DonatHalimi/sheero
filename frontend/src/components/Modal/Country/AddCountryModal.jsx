import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError, LoadingLabel } from '../../../assets/CustomComponents';
import { addCountryService } from '../../../services/countryService';

const AddCountryModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [isValidName, setIsValidName] = useState(true);
    const [countryCode, setCountryCode] = useState('');
    const [isValidCode, setIsValidCode] = useState(true);
    const [loading, setLoading] = useState(false);

    const validateName = (v) => /^[A-ZÇ][a-zA-ZëËçÇ\s]{3,35}$/.test(v);
    const validateCountryCode = (v) => /^[A-Z]{2,3}$/.test(v);

    const isValidForm = isValidName && isValidCode && name && countryCode;

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

                <BrownButton
                    onClick={handleAddCountry}
                    variant="contained"
                    color="primary"
                    disabled={!isValidForm || loading}
                    className="w-full"
                >
                    <LoadingLabel loading={loading} />
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddCountryModal;
