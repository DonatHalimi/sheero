import { Box, Button, Modal } from '@mui/material';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';
import { OutlinedBrownButton } from '../../Dashboard/CustomComponents';

const DeleteAddressModal = ({ open, onClose, address, onDeleteSuccess }) => {
    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    const handleDeleteAddress = async () => {
        try {
            await axiosInstance.delete(`/addresses/delete/${address._id}`);
            toast.success('Address deleted successfully');
            onDeleteSuccess();
            onClose();
        } catch (error) {
            console.error('Error deleting address', error);
            toast.error('Error deleting address');
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div className="flex items-center justify-center h-screen">
                <Box className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-xl font-bold mb-2">Delete address</h2>
                    <p className="mb-4">Are you sure you want to delete the address "{address?.name}"?</p>
                    <div className="flex justify-end">
                        <OutlinedBrownButton
                            onClick={onClose}
                            variant="outlined"
                            className='!mr-4'
                        >
                            Cancel
                        </OutlinedBrownButton>
                        <Button
                            onClick={handleDeleteAddress}
                            variant="contained"
                            color="error"
                            className="mr-2"
                        >
                            Delete
                        </Button>
                    </div>
                </Box>
            </div>
        </Modal>
    );
};

export default DeleteAddressModal;
