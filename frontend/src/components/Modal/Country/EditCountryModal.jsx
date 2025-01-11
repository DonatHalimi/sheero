import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError } from '../../../assets/CustomComponents';
import useAxios from '../../../utils/axiosInstance';

const EditCountryModal = ({ open, onClose, country, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [isValidName, setIsValidName] = useState(true);

    const axiosInstance = useAxios();

    const validateName = (v) => /^[A-Z][a-zA-Z\s]{3,15}$/.test(v);

    const isValidForm = isValidName;

    useEffect(() => {
        if (country) {
            setName(country.name);
        }
    }, [country]);

    const handleEditCountry = async () => {
        if (!name) {
            toast.error('Please fill in the country name', { closeOnClick: true });
            return;
        }

        const updatedData = {
            name
        }

        try {
            const response = await axiosInstance.put(`/countries/update/${country._id}`, updatedData);
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
                    helperText={!isValidName ? 'Name must start with a capital letter and be 3-15 characters long' : ''}
                    className="!mb-4"
                />

                <BrownButton
                    onClick={handleEditCountry}
                    variant="contained"
                    color="primary"
                    disabled={!isValidForm}
                    className="w-full"
                >
                    Save
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default EditCountryModal;
