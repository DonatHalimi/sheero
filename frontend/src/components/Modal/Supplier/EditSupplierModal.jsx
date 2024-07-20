import { Box, Modal, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';
import { BrownButton, BrownOutlinedTextField } from '../../Dashboard/CustomComponents';

const EditSupplierModal = ({ open, onClose, supplier, onEditSuccess }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [phoneNumber, setPhoneNumber] = useState('');

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        if (supplier) {
            setName(supplier.name);
            if (supplier.contactInfo) {
                setEmail(supplier.contactInfo.email)
                setPhoneNumber(supplier.contactInfo.phoneNumber)
            }
        }

    }, [supplier]);

    const handleEditSupplier = async () => {
        try {
            await axiosInstance.put(`/suppliers/update/${supplier._id}`, {
                name,
                contactInfo: {
                    email,
                    phoneNumber,
                },
            });
            toast.success('Supplier updated successfully');
            onEditSuccess();
            onClose();
        } catch (error) {
            console.error('Error updating supplier', error);
            toast.error('Error updating supplier');
        }
    };

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    };

    return (
        <Modal open={open} onClose={onClose} className='flex items-center justify-center'>
            <Box className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
                <Typography variant='h5' className="!text-xl !font-bold !mb-6">Edit Supplier</Typography>
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
                    type='email'
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
                    onClick={handleEditSupplier}
                    variant="contained"
                    color="primary"
                    className="w-full"
                >
                    Save Changes
                </BrownButton>
            </Box>
        </Modal>
    );
};

export default EditSupplierModal;