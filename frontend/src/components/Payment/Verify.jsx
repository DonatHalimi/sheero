import { Box, CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useAxios from '../../axiosInstance';
import CancelPayment from './CancelPayment';
import SuccessPayment from './SuccessPayment';

const Verify = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const session_id = searchParams.get('session_id');
    const order_id = searchParams.get('order_id');
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);
    const axiosInstance = useAxios();

    useEffect(() => {
        const verifyPayment = async () => {
            const data = {
                order_id,
                success: searchParams.get('success') === 'true'
            };

            try {
                const response = await axiosInstance.post('/orders/verify', data);

                if (response.data.success) {
                    setSuccess(true);
                } else {
                    setError(response.data.message);
                    setSuccess(false);
                }
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setSuccess(false);
            } finally {
                setLoading(false);
            }
        };

        if (session_id && order_id) {
            verifyPayment();
        } else {
            setError('Missing required parameters');
            setLoading(false);
        }
    }, [session_id, order_id, axiosInstance]);

    if (loading) {
        return (
            <CircularProgress />
        );
    }

    if (error) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
                <Typography variant="h4" color="error">Verification Failed</Typography>
                <Typography variant="body1">{error}</Typography>
            </Box>
        );
    }

    return success ? <SuccessPayment /> : <CancelPayment />;
};

export default Verify;