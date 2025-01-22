import React from 'react';
import { toast } from 'react-toastify';
import { CustomDeleteModal } from '../../assets/CustomComponents';
import useAxios from '../../utils/axiosInstance';

const DeleteModal = ({ open, onClose, items, onDeleteSuccess, endpoint, title, message }) => {
    const axiosInstance = useAxios();

    const handleDelete = async () => {
        const idsToDelete = items.map(item => item._id).filter(id => id);

        try {
            await axiosInstance.delete(endpoint, { data: { ids: idsToDelete } });

            const itemType = title.replace('Delete', '').trim();
            toast.success(`${itemType} deleted successfully`);
            onDeleteSuccess();
            onClose();
        } catch (error) {
            const itemType = title.replace('Delete', '').trim();

            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(`Error deleting ${itemType}`);
            }

            console.error(`Error deleting ${itemType}`, error);
        }
    };

    return (
        <CustomDeleteModal
            open={open}
            onClose={onClose}
            title={title}
            message={message}
            onDelete={handleDelete}
        />
    );
};

export default DeleteModal;