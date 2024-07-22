import { Box, Button, Modal } from '@mui/material';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';
import { OutlinedBrownButton } from '../../Dashboard/CustomComponents';

const DeleteSubcategoryModal = ({ open, onClose, subcategories, onDeleteSuccess }) => {
    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    const handleDeleteSubcategories = async () => {
        try {
            await axiosInstance.delete('/subcategories/delete-bulk', { data: { subcategoryIds: subcategories.map(subcategory => subcategory._id).filter(id => id) } });
            toast.success('Subcategories deleted successfully');
            onDeleteSuccess();
            onClose();
        } catch (error) {
            toast.error('Error deleting subcategories');
            console.error('Error deleting subcategories', error);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div className="flex items-center justify-center h-screen">
                <Box className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-bold mb-2">Delete Subcategory</h2>
                    <p className="mb-4">Are you sure you want to delete the selected subcategories?</p>
                    <div className="flex justify-end">
                        <OutlinedBrownButton
                            onClick={onClose}
                            variant="outlined"
                            className='!mr-4'
                        >
                            Cancel
                        </OutlinedBrownButton>
                        <Button
                            onClick={handleDeleteSubcategories}
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

export default DeleteSubcategoryModal;