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
            }

            try {
                const response = await axiosInstance.post('/orders/verify', data);
                setSuccess(response.data.success);
            } catch (err) {
                console.error('Verification failed:', err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (session_id && order_id) {
            verifyPayment();
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