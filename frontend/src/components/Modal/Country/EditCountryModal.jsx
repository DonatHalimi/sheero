import { Box, Modal, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';

const EditCountryModal = ({ open, onClose, country, onEditSuccess }) => {
    const [name, setName] = useState('');
    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        if (country) {
            setName(country.name);
        }
    }, [country]);

    const handleEditCountry = async () => {
        if (!name) {
            toast.error('Please fill in the country name', {
                closeOnClick: true
            });
            return;
        }

        try {
            await axiosInstance.put(`/countries/update/${country._id}`, { name });
            toast.success('Country updated successfully');
            onEditSuccess();
            onClose();
        } catch (error) {
            toast.error('Error updating country');
            console.error('Error updating country', error);
        }
    };

    return (
        <Modal open={open} onClose={onClose} className="flex items-center justify-center">
            <Box className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
                <Typography variant='h5' className="!text-xl !font-bold !mb-6">Edit Country</Typography>
                <BrownOutlinedTextField
                    fullWidth
                    required
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="!mb-4"
                />
                <BrownButton
                    onClick={handleEditCountry}
                    variant="contained"
                    color="primary"
                    className="w-full"
                >
                    Save
                </BrownButton>
            </Box>
        </Modal>
    );
};

export default EditCountryModal;
