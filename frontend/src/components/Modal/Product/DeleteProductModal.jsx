import { Box, Button, Modal } from '@mui/material';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';
import { OutlinedBrownButton } from '../../Dashboard/CustomComponents';

const DeleteProductModal = ({ open, onClose, products, onDeleteSuccess }) => {
    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    const handleDeleteProducts = async () => {
        try {
            await axiosInstance.delete('/products/delete-bulk', { data: { productIds: products.map(product => product._id) } });
            toast.success('Products deleted successfully');
            onDeleteSuccess();
            onClose();
        } catch (error) {
            toast.error('Error deleting products');
            console.error('Error deleting products', error);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div className="flex items-center justify-center h-screen">
                <Box className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-xl font-bold mb-2">Delete Products</h2>
                    <p className="mb-4">Are you sure you want to delete the selected products?</p>
                    <div className="flex justify-end">
                        <OutlinedBrownButton
                            onClick={onClose}
                            variant="outlined"
                            className='!mr-4'
                        >
                            Cancel
                        </OutlinedBrownButton>
                        <Button
                            onClick={handleDeleteProducts}
                            variant="contained"
                            color="error"
                            className="!mr-2"
                        >
                            Delete
                        </Button>
                    </div>
                </Box>
            </div>
        </Modal>
    );
};

export default DeleteProductModal;