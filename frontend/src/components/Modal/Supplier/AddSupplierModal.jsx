import { Box, Modal, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';

const AddSupplierModal = ({ open, onClose, onAddSuccess }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState('');

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    const handleAddSupplier = async () => {
        if (!name || !email || !phoneNumber) {
            toast.error('Please fill in all the fields', {
                closeOnClick: true,
            });
            return;
        }

        try {
            await axiosInstance.post('/suppliers/create', {
                name,
                contactInfo: {
                    email,
                    phoneNumber,
                },
            });
            toast.success('Supplier added successfully');
            onAddSuccess();
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
        <Modal open={open} onClose={onClose} className="flex items-center justify-center">
            <Box className="bg-white p-4 rounded-lg shadow-lg max-w-md">
                <Typography variant='h5' className="!text-xl !font-bold !mb-4">Add Supplier</Typography>
                <BrownOutlinedTextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
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
                    className='!mb-4'
                    type="email"
                    error={!isValidEmail}
                    helperText={!isValidEmail ? "Please enter a valid email address" : ""}
                />
                <BrownOutlinedTextField
                    label="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    fullWidth
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
            </Box>
        </Modal>
    );
};

export default AddSupplierModal;
