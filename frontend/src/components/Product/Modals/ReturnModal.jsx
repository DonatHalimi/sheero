import { Checkbox, FormControl, FormControlLabel, InputLabel, ListItemText, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BrownButton, CustomBox, CustomModal, LoadingReturn } from '../../../assets/CustomComponents';
import { getOrderDetailsService } from '../../../services/orderService';
import { addReturnRequestService } from '../../../services/returnService';
import { getImageUrl } from '../../../utils/config';

const ReturnModal = ({ open, onClose }) => {
    const { orderId } = useParams();
    const [orderProducts, setOrderProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [reason, setReason] = useState('');
    const [customReason, setCustomReason] = useState('');
    const [confirmSelection, setConfirmSelection] = useState(false);

    const [loading, setLoading] = useState(true);

    const [customReasonValid, setCustomReasonValid] = useState(true);
    const [focusedField, setFocusedField] = useState(null);

    const validateCustomReason = (reason) => /^[A-Z][a-zA-Z\s]{5,20}$/.test(reason);

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
            const response = await getOrderDetailsService(orderId);
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
        const value = event.target.value;
        setSelectedProducts(value);
    };

    const handleReasonChange = (event) => {
        const value = event.target.value;
        setReason(value);
        if (value !== 'Other') {
            setCustomReason('');
        }
    };

    const handleCustomReasonChange = (event) => {
        const value = event.target.value;
        setCustomReason(value);
        setCustomReasonValid(validateCustomReason(value));
    };

    const handleSubmit = async () => {
        if (selectedProducts.length === 0 || reason.trim() === '') {
            toast.error("Please select at least one product and provide a reason for the return.");
            return;
        }

        if (reason === 'Other' && !customReasonValid) {
            toast.error('Custom reason must start with a capital letter and be 5 to 20 characters long.');
            return;
        }

        const returnData = {
            orderId: orderId,
            productIds: selectedProducts,
            reason: reason,
            customReason: reason === 'Other' ? customReason : undefined,
        };

        try {
            await addReturnRequestService(returnData);

            toast.success('Return request submitted successfully', {
                onClick: () => navigate('/profile/returns'),
            });
            onClose();
        } catch (error) {
            if (error.response && error.response.status === 400 && error.response.data.errors) {
                error.response.data.errors.forEach(err => {
                    toast.info(`${err.message}`, {
                        onClick: () => navigate('/profile/returns'),
                    });
                });
            } else {
                toast.error(error.response?.data?.message || 'Error submitting return request.');
            }
            console.error('Error submitting return request:', error);
        }
    };

    const isDisabled = !selectedProducts.length || !reason || (reason === 'Other' && !customReasonValid) || !confirmSelection;

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
                            <>
                                <TextField
                                    label="Please specify the reason"
                                    fullWidth
                                    value={customReason}
                                    onChange={handleCustomReasonChange}
                                    onFocus={() => setFocusedField('customReason')}
                                    onBlur={() => setFocusedField(null)}
                                    variant="outlined"
                                    margin="normal"
                                />
                                {focusedField === 'customReason' && !customReasonValid && (
                                    <div className="absolute left-4 right-4 bottom-[57px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md z-10">
                                        <span className="block text-xs font-semibold mb-1">Invalid Reason</span>
                                        Must start with a capital letter and be 5 to 20 characters long.
                                        <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
                                    </div>
                                )}
                            </>
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