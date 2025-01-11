import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError } from '../../../assets/CustomComponents';
import useAxios from '../../../utils/axiosInstance';

const AddReturnRequestModal = ({ open, onClose, onAddSuccess }) => {
    const [order, setOrder] = useState('');
    const [product, setProduct] = useState('');
    const [user, setUser] = useState('');
    const [reason, setReason] = useState('');
    const [isValidOrder, setIsValidOrder] = useState(true);

    const axiosInstance = useAxios();

    const validateOrder = (id) => /^\d{9}$/.test(id);

    const handleAddReturnRequest = async () => {
        if (!order || !product || !user || !reason) {
            toast.error('Please fill in all the fields');
            return;
        }

        const data = {
            order,
            product,
            user,
            reason,
        };

        try {
            const response = await axiosInstance.post('/returns/create', data);
            toast.success(response.data.message);
            onAddSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error adding return request');
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Add Return Request</CustomTypography>

                <BrownOutlinedTextField
                    label="Order ID"
                    value={order}
                    onChange={(e) => {
                        setOrder(e.target.value);
                        setIsValidOrder(validateOrder(e.target.value));
                    }}
                    fullWidth
                    required
                    error={!isValidOrder}
                    helperText={!isValidOrder ? "Please enter a valid order ID" : ""}
                    className='!mb-4'
                />
                <BrownOutlinedTextField
                    label="Product"
                    value={product}
                    onChange={(e) => setProduct(e.target.value)}
                    fullWidth
                    required
                    className='!mb-4'
                />
                <BrownOutlinedTextField
                    label="User"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    fullWidth
                    required
                    className='!mb-4'
                />
                <BrownOutlinedTextField
                    label="Reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    fullWidth
                    required
                    className='!mb-4'
                />
                <BrownButton
                    onClick={handleAddReturnRequest}
                    variant="contained"
                    color="primary"
                    className="w-full"
                >
                    Add Return Request
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddReturnRequestModal;