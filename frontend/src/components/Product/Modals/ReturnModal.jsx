import { Checkbox, FormControl, FormControlLabel, InputLabel, ListItemText, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BrownButton, CustomBox, CustomModal, LoadingReturn } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';
import { getImageUrl } from '../../../config';

const ReturnModal = ({ open, onClose }) => {
    const { orderId } = useParams();
    const [orderProducts, setOrderProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [reason, setReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [confirmSelection, setConfirmSelection] = useState(false);
    const [loading, setLoading] = useState(true);

    const axiosInstance = useAxios();
    const navigate = useNavigate();

    const returnReasons = [
        'Damaged Item',
        'Wrong Item Delivered',
        'Item Not as Described',
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
                const products = response.data.data.products;
                setOrderProducts(products);
                setSelectedProducts(products.map(({ product }) => product._id));
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
            toast.error("Please select at least one product and provide a reason for the return.");
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

    const isDisabled = !selectedProducts.length || !reason || (reason === 'Other' && customReason.length < 5 || customReason.length > 20) || !confirmSelection;

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <Typography variant="h6" className='!mb-3'>
                    Return Products
                </Typography>
                {loading ? (
                    <LoadingReturn />
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
                                    <MenuItem key={product._id} value={product._id} className='flex items-center'>
                                        <Checkbox checked={selectedProducts.indexOf(product._id) > -1} />
                                        <img
                                            src={getImageUrl(product.image)}
                                            alt={product.name}
                                            className='w-7 h-7 object-contain mr-2'
                                        />
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    variant="body2"
                                                    noWrap
                                                    style={{ maxWidth: 300 }}
                                                >
                                                    {product.name}
                                                </Typography>
                                            }
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

                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={confirmSelection}
                                    onChange={(e) => setConfirmSelection(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="I confirm the selected products are correct"
                        />

                        <BrownButton
                            onClick={handleSubmit}
                            disabled={isDisabled}
                            fullWidth
                            className='!mt-3'
                        >
                            Submit Return Request
                        </BrownButton>
                    </>
                )}
            </CustomBox>
        </CustomModal>
    );
};

export default ReturnModal;