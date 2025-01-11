import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError } from '../../../assets/CustomComponents';
import useAxios from '../../../utils/axiosInstance';

const AddCountryModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [isValidName, setIsValidName] = useState(true);

    const axiosInstance = useAxios();

    const validateName = (v) => /^[A-Z][a-zA-Z\s]{3,15}$/.test(v);

    const isValidForm = isValidName;

    const handleAddCountry = async () => {
        if (!name) {
            toast.error('Please fill in the country name');
            return;
        }

        const data = {
            name
        }

        try {
            const response = await axiosInstance.post('/countries/create', data);
            toast.success(response.data.message);
            onAddSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error adding country');
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
                    helperText={!isValidName ? 'Name must start with a capital letter and be 3-15 characters long' : ''}
                    className="!mb-4"
                />
                <BrownButton
                    onClick={handleAddCountry}
                    variant="contained"
                    color="primary"
                    disabled={!isValidForm}
                    className="w-full"
                >
                    Add
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddCountryModal;
