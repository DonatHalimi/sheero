import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { CustomDeleteModal } from '../../assets/CustomComponents';
import axiosInstance from '../../utils/axiosInstance';

const DeleteModal = ({ open, onClose, items, onDeleteSuccess, endpoint, title, message }) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);

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
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomDeleteModal
            open={open}
            onClose={onClose}
            title={title}
            message={message}
            onDelete={handleDelete}
            loading={loading}
        />
    );
};

export default DeleteModal;