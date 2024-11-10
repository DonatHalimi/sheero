import { Button, Checkbox, CircularProgress, FormControl, InputLabel, ListItemText, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CustomBox, CustomModal } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import { getImageUrl } from '../../config';

const ReturnModal = ({ open, onClose }) => {
    const { orderId } = useParams();
    const [orderProducts, setOrderProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [reason, setReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [loading, setLoading] = useState(true);

    const axiosInstance = useAxios();
    const navigate = useNavigate();

    const returnReasons = [
        'Damaged Item',
        'Wrong Item Delivered',
        'Item Not as Described',
        'Too Big/Too Small',
        'Changed My Mind',
        'Other'
    ];

    useEffect(() => {
        if (open && orderId) {
            fetchOrderDetails();
        }
    }, [open, orderId]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get(`/orders/${orderId}`);
            if (response.data.success) {
                setOrderProducts(response.data.data.products);
            } else {
                console.error('Failed to fetch order products');
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProductChange = (event) => {
        const { value } = event.target;
        setSelectedProducts(value);
    };

    const handleReasonChange = (event) => {
        const { value } = event.target;
        setReason(value);
        if (value !== 'Other') {
            setCustomReason('');
        }
    };

    const handleCustomReasonChange = (event) => {
        setCustomReason(event.target.value);
    };

    const handleSubmit = async () => {
        if (selectedProducts.length === 0 || reason.trim() === '') {
            alert("Please select at least one product and provide a reason for the return.");
            return;
        }

        if (reason === 'Other') {
            const customReasonLength = customReason.trim().length;

            if (customReasonLength < 5) {
                toast.error('Custom reason must be at least 5 characters long');
                return;
            }

            if (customReasonLength > 20) {
                toast.error('Custom reason must not exceed 20 characters');
                return;
            }
        }

        const returnData = {
            orderId: orderId,
            productIds: selectedProducts,
            reason: reason,
            customReason: reason === 'Other' ? customReason : undefined,
        };

        try {
            await axiosInstance.post('/returns/create', returnData);
            toast.success('Return request made successfully', {
                onClick: () => navigate('/profile/returns'),
            });
            onClose();
        } catch (error) {
            toast.info(error.response?.data?.message, {
                onClick: () => navigate('/profile/returns'),
            });
            console.error('Error submitting return request:', error);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose} aria-labelledby="return-modal" aria-describedby="return-modal-description">
            <CustomBox>
                <Typography variant="h6" className='!mb-3'>
                    Return Products
                </Typography>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <>
                        <FormControl fullWidth>
                            <InputLabel>Products</InputLabel>
                            <Select
                                multiple
                                value={selectedProducts}
                                onChange={handleProductChange}
                                renderValue={(selected) =>
                                    selected
                                        .map((id) => orderProducts.find(({ product }) => product._id === id)?.product.name)
                                        .join(', ') || ''
                                }
                            >
                                {orderProducts.map(({ product, quantity }) => (
                                    <MenuItem key={product._id} value={product._id} style={{ display: 'flex', alignItems: 'center' }}>
                                        <Checkbox checked={selectedProducts.indexOf(product._id) > -1} />
                                        <img
                                            src={getImageUrl(product.image)}
                                            alt={product.name}
                                            className='w-7 h-7 object-contain mr-2'
                                        />
                                        <ListItemText
                                            primary={product.name}
                                            secondary={`Qty: ${quantity}`}
                                        />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Reason for Return</InputLabel>
                            <Select
                                value={reason}
                                onChange={handleReasonChange}
                                label="Reason for Return"
                                required
                            >
                                {returnReasons.map((r) => (
                                    <MenuItem key={r} value={r}>
                                        {r}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {reason === 'Other' && (
                            <TextField
                                label="Please specify the reason"
                                multiline
                                rows={4}
                                fullWidth
                                value={customReason}
                                onChange={handleCustomReasonChange}
                                variant="outlined"
                                margin="normal"
                            />
                        )}

                        <Button variant="contained" color="primary" onClick={handleSubmit} className='!mt-3'>
                            Submit Return Request
                        </Button>
                    </>
                )}
            </CustomBox>
        </CustomModal>
    );
};

export default ReturnModal;