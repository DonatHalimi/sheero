import { Box, Button, Modal } from '@mui/material';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import { OutlinedBrownButton } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';

const DeleteCityModal = ({ open, onClose, cities, onDeleteSuccess }) => {
    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    const handleDeleteCities = async () => {
        try {
            await axiosInstance.delete('/cities/delete-bulk', { data: { cityIds: cities.map(city => city._id).filter(id => id) } });
            toast.success('Cities deleted successfully');
            onDeleteSuccess();
            onClose();
        } catch (error) {
            toast.error('Error deleting cities');
            console.error('Error deleting cities', error);
        }
    };

    return (
        <Modal open={open} onClose={onClose} className="flex items-center justify-center">
            <div className="flex items-center justify-center h-screen">
                <Box className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-xl font-bold mb-2">Delete Cities</h2>
                    <p className="mb-4">Are you sure you want to delete the selected cities?</p>
                    <div className="flex justify-end">
                        <OutlinedBrownButton
                            onClick={onClose}
                            variant="outlined"
                            className='!mr-4'
                        >
                            Cancel
                        </OutlinedBrownButton>
                        <Button
                            onClick={handleDeleteCities}
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

export default DeleteCityModal;
