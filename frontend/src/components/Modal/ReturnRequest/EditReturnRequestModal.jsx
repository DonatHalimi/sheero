import { MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ActionButtons, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError, ReadOnlyTextField } from '../../../assets/CustomComponents';
import { editReturnRequestStatusService } from '../../../services/returnService';

const EditReturnRequestModal = ({ open, onClose, returnRequest, onViewDetails, onEditSuccess }) => {
    const [status, setStatus] = useState(returnRequest ? returnRequest.status : 'pending');
    const [loading, setLoading] = useState(false);

    const user = `${returnRequest?.user.firstName} ${returnRequest?.user.lastName} - ${returnRequest?.user.email}`;
    const products = typeof returnRequest?.products === 'string'
        ? returnRequest.products.split(', ').map((productName, index) => ({
            _id: `unknown-${index}`,
            name: productName.trim(),
        })) : Array.isArray(returnRequest?.products)
            ? returnRequest.products
            : [];


    useEffect(() => {
        if (returnRequest) {
            setStatus(returnRequest.status);
        }
    }, [returnRequest]);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            toast.success('Return Request ID copied to clipboard!');
        });
    };

    const handleEditReturnRequest = async () => {
        setLoading(true);

        if (!status) {
            toast.error('Please select a status');
            return;
        }

        const updatedData = {
            status,
        };

        try {
            const response = await editReturnRequestStatusService(returnRequest._id, updatedData);

            toast.success(response.data.message, {
                onClick: () => copyToClipboard(returnRequest._id),
                autoClose: 6000
            });

            onEditSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error updating return request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit Return Request Status</CustomTypography>

                <ReadOnlyTextField
                    label="Order ID"
                    value={returnRequest?.order}
                    className="!mb-4"
                />

                <ReadOnlyTextField
                    label="User"
                    value={user}
                    className="!mb-4"
                />

                <ReadOnlyTextField
                    label="Product(s)"
                    value={products
                        .map(product => product?.name || 'Unknown Product')
                        .join(', ')}
                    multiline
                    rows={4}
                    className="!mb-4"
                />

                <ReadOnlyTextField
                    label="Reason"
                    value={returnRequest?.reason}
                    className="!mb-4"
                />

                {returnRequest?.reason === 'Other' && returnRequest?.customReason && (
                    <ReadOnlyTextField
                        label="Custom Reason"
                        value={returnRequest?.customReason}
                        className="!mb-4"
                    />
                )}

                <BrownOutlinedTextField
                    select
                    fullWidth
                    label="Return Request Status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="!mb-4"
                >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="processed">Processed</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                </BrownOutlinedTextField>

                <ActionButtons
                    primaryButtonLabel="Save"
                    secondaryButtonLabel="View Details"
                    onPrimaryClick={handleEditReturnRequest}
                    onSecondaryClick={() => {
                        onViewDetails(returnRequest);
                        onClose();
                    }}
                    primaryButtonProps={{
                        disabled: loading
                    }}
                    loading={loading}
                />
            </CustomBox>
        </CustomModal>
    );
};

export default EditReturnRequestModal;