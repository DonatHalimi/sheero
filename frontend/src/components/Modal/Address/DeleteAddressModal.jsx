import { Box, Button, Modal } from '@mui/material';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import { OutlinedBrownButton } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';

const DeleteAddressModal = ({ open, onClose, addresses, onDeleteSuccess }) => {
    const axiosInstance = useAxios();

    const handleDeleteAddresses = async () => {
        try {
            const addressIds = addresses.map(address => address._id).filter(id => id);

            await axiosInstance.delete('/addresses/delete-bulk', { data: { addressIds } });
            toast.success('Addresses deleted successfully');
            onDeleteSuccess();
            onClose();
        } catch (error) {
            toast.error('Error deleting addresses');
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div className="flex items-center justify-center h-screen">
                <Box className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-xl font-bold mb-2">Delete Addresses</h2>
                    <p className="mb-4">Are you sure you want to delete the selected addresses?</p>
                    <div className="flex justify-end">
                        <OutlinedBrownButton
                            onClick={onClose}
                            variant="outlined"
                            className='!mr-4'
                        >
                            Cancel
                        </OutlinedBrownButton>
                        <Button
                            onClick={handleDeleteAddresses}
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