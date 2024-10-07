import { MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
    BrownButton,
    BrownOutlinedTextField,
    CustomBox,
    CustomModal,
    CustomTypography
} from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';

const EditOrderModal = ({ open, onClose, order, onEditSuccess }) => {
    const [newStatus, setNewStatus] = useState(order?.status || '');

    const axiosInstance = useAxios();

    useEffect(() => {
        if (order) {
            setNewStatus(order.status);
        }
    }, [order]);

    const handleEditOrder = async () => {
        if (!newStatus) {
            toast.error('Please select a status', {
                closeOnClick: true
            });
            return;
        }

        const updateData = {
            orderId: order._id,
            status: newStatus
        };

        if (order.paymentMethod === 'cash') {
            if (newStatus === 'delivered') {
                updateData.paymentStatus = 'completed';
            } else if (newStatus === 'canceled') {
                updateData.paymentStatus = 'failed';
            } else if (['pending', 'shipped'].includes(newStatus)) {
                updateData.paymentStatus = 'pending';
            }
        }

        try {
            const response = await axiosInstance.put(`/orders/status/update`, updateData);
            toast.success(response.data.message);
            onEditSuccess(response.data);
            onClose();
        } catch (error) {
            toast.error('Error updating order');
            console.error('Error updating order', error);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit Order Status</CustomTypography>

                <BrownOutlinedTextField
                    select
                    fullWidth
                    label="Order Status"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="!mb-4"
                >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="shipped">Shipped</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                    <MenuItem value="canceled">Canceled</MenuItem>
                </BrownOutlinedTextField>

                <BrownButton
                    onClick={handleEditOrder}
                    variant="contained"
                    color="primary"
                    className="w-full"
                >
                    Save
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default EditOrderModal;