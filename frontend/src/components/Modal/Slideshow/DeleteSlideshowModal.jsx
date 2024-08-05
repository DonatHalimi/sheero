import { Box, Button, Modal } from '@mui/material';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';
import { OutlinedBrownButton } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';

const DeleteSlideshowModal = ({ open, onClose, images, onDeleteSuccess }) => {
    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    const handleDeleteImages = async () => {
        try {
            await axiosInstance.delete('/slideshow/delete-bulk', { data: { imageIds: images.map(image => image._id) } });
            toast.success('Slideshow images deleted successfully');
            onDeleteSuccess();
            onClose();
        } catch (error) {
            toast.error('Error deleting slideshow images');
            console.error('Error deleting slideshow images', error);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <div className="flex items-center justify-center h-screen">
                <Box className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-xl font-bold mb-2">Delete Slideshow Images</h2>
                    <p className="mb-4">Are you sure you want to delete the selected slideshow images?</p>
                    <div className="flex justify-end">
                        <OutlinedBrownButton
                            onClick={onClose}
                            variant="outlined"
                            className='!mr-4'
                        >
                            Cancel
                        </OutlinedBrownButton>
                        <Button
                            onClick={handleDeleteImages}
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

export default DeleteSlideshowModal;
