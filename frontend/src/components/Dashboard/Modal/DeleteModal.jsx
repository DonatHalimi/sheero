import { useState } from 'react';
import { toast } from 'react-toastify';
import { CustomDeleteModal } from '../../../components/custom/MUI';
import axiosInstance from '../../../utils/api/axiosInstance';

const DeleteModal = ({ open, onClose, deletionContext, onDeleteSuccess, title, message }) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);

        try {
            if (deletionContext?.endpoint) {
                await axiosInstance.delete(deletionContext.endpoint, { data: deletionContext.data });
                const itemType = title.replace('Delete', '').trim();
                const capitalizedItemType = itemType.charAt(0).toUpperCase() + itemType.slice(1);
                toast.success(`${capitalizedItemType} deleted successfully`);
                onDeleteSuccess();
                onClose();
            }
        } catch (error) {
            const itemType = title.replace('Delete', '').trim();
            if (error.response?.data?.message) {
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