import { Box, Button, Modal } from '@mui/material';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';
import { OutlinedBrownButton } from '../../Dashboard/CustomComponents';

const DeleteUserModal = ({ open, onClose, users, onDeleteSuccess }) => {
    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    const handleDeleteUsers = async () => {
        try {
            await axiosInstance.delete('/users/delete-bulk', { data: { userIds: users.map(user => user._id).filter(id => id) } });
            toast.success('Users deleted successfully');
            onDeleteSuccess();
            onClose();
        } catch (error) {
            toast.error('Error deleting users');
            console.error('Error deleting users', error);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div className="flex items-center justify-center h-screen">
                <Box className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-xl font-bold mb-2">Delete Users</h2>
                    <p className="mb-4">Are you sure you want to delete the selected users?</p>
                    <div className="flex justify-end">
                        <OutlinedBrownButton
                            onClick={onClose}
                            variant="outlined"
                            className='!mr-4'
                        >
                            Cancel
                        </OutlinedBrownButton>
                        <Button
                            onClick={handleDeleteUsers}
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

export default DeleteUserModal;