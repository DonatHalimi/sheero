import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError, knownEmailProviders } from '../../../assets/CustomComponents';
import useAxios from '../../../utils/axiosInstance';

const AddSupplierModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [isValidName, setIsValidName] = useState(true);
    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);

    const axiosInstance = useAxios();

    const validateName = (v) => /^[A-Z][a-zA-Z]{2,15}$/.test(v);
    const validatePhoneNumber = (v) => /^0(44|45|48|49)\d{6}$/.test(v);
    const validateEmail = (v) => new RegExp(`^[a-zA-Z0-9._%+-]+@(${knownEmailProviders.join('|')})$`, 'i').test(v);

    const isValidForm = name && isValidName && email && isValidEmail && phoneNumber && isValidPhoneNumber;

    const handleAddSupplier = async () => {
        if (!name || !email || !phoneNumber) {
            toast.error('Please fill in all the fields');
            return;
        }

        const data = {
            name,
            contactInfo: {
                email,
                phoneNumber,
            },
        }

        try {
            const response = await axiosInstance.post('/suppliers/create', data);
            toast.success(response.data.message);
            onAddSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error adding supplier');
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Add Supplier</CustomTypography>

                <BrownOutlinedTextField
                    label="Name"
                    value={name}
                    fullWidth
                    required
                    onChange={(e) => {
                        setName(e.target.value);
                        setIsValidName(validateName(e.target.value));
                    }}
                    error={!isValidName}
                    helperText={!isValidName ? "Name must start with a capital letter and be 2-15 characters long" : ""}
                    className='!mb-4'
                />
                <BrownOutlinedTextField
                    label="Email"
                    value={email}
                    fullWidth
                    required
                    type="email"
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setIsValidEmail(validateEmail(e.target.value));
                    }}
                    error={!isValidEmail}
                    helperText={!isValidEmail ? "Please enter a valid email address" : ""}
                    className='!mb-4'
                />
                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Phone Number"
                    value={phoneNumber}
                    placeholder="044/45/48 XXXXXX"
                    onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        setIsValidPhoneNumber(validatePhoneNumber(e.target.value));
                    }}
                    error={!isValidPhoneNumber}
                    helperText={!isValidPhoneNumber ? "Phone number must start with 044, 045, 048 or 049 followed by 6 digits" : ""}
                    className='!mb-4'
                />
                <BrownButton
                    onClick={handleAddSupplier}
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

export default AddSupplierModal;
