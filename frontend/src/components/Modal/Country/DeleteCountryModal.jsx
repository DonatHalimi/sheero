import { Box, Button, Modal } from '@mui/material';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import useAxios from '../../../axiosInstance'; 
import { AuthContext } from '../../../context/AuthContext';
import { OutlinedBrownButton } from '../../Dashboard/CustomComponents';

const DeleteCountryModal = ({ open, onClose, country, onDeleteSuccess }) => {
    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    const handleDeleteCountry = async () => {
        try {
            await axiosInstance.delete(`/countries/delete/${country._id}`);
            toast.success('Country deleted successfully');
            onDeleteSuccess();
            onClose();
        } catch (error) {
            toast.error('Error deleting country');
            console.error('Error deleting country', error);
        }
    };

    return (
        <Modal open={open} onClose={onClose} className="flex items-center justify-center">
            <div className="flex items-center justify-center h-screen">

                <Box className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-xl font-bold mb-2">Delete Country</h2>
                    <p className="mb-4">Are you sure you want to delete the country "{country?.name}"?</p>
                    <div className="flex justify-end">
                        <OutlinedBrownButton
                            onClick={onClose}
                            variant="outlined"
                            className='!mr-4'
                        >
                            Cancel
                        </OutlinedBrownButton>
                        <Button
                            onClick={handleDeleteCountry}
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

export default DeleteCountryModal;
