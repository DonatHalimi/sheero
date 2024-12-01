import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';

const AddSupplierModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState('');

    const axiosInstance = useAxios();

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
            console.error('Error adding supplier', error);
            toast.error('Error adding supplier');
        }
    };

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Add Supplier</CustomTypography>

                <BrownOutlinedTextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    required
                    className='!mb-4'
                />
                <BrownOutlinedTextField
                    label="Email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setIsValidEmail(validateEmail(e.target.value));
                    }}
                    fullWidth
                    required
                    className='!mb-4'
                    type="email"
                    error={!isValidEmail}
                    helperText={!isValidEmail ? "Please enter a valid email address" : ""}
                />
                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="044/45/48 XXXXXX"
                    className='!mb-4'
                />
                <BrownButton
                    onClick={handleAddSupplier}
                    variant="contained"
                    color="primary"
                    className="w-full"
                >
                    Add
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddSupplierModal;
