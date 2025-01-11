import { MenuItem, Select, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, CustomBox, CustomModal, handleApiError } from '../../../assets/CustomComponents';
import useAxios from '../../../utils/axiosInstance';

const EditReturnRequestModal = ({ open, onClose, returnRequest, onEditSuccess }) => {
    const [status, setStatus] = useState(returnRequest ? returnRequest.status : 'pending');

    const axiosInstance = useAxios();

    useEffect(() => {
        if (returnRequest) {
            setStatus(returnRequest.status);
        }
    }, [returnRequest]);

    const handleEditReturnRequest = async () => {
        const updatedData = {
            status,
        };

        try {
            const response = await axiosInstance.put('/returns/manage', {
                requestId: returnRequest._id,
                status,
                ...updatedData
            });
            toast.success(response.data.message);
            onEditSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error updating return request');
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <Typography variant="h5">Edit Status</Typography>

                <Select
                    label="Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    fullWidth
                    className="!mb-4"
                >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="processed">Processed</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                </Select>

                <BrownButton
                    onClick={handleEditReturnRequest}
                    variant="contained"
                    color="primary"
                    className="w-full"
                >
                    Save Changes
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default EditReturnRequestModal;