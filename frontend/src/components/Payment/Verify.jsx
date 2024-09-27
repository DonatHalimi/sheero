import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SuccessPayment from './SuccessPayment';
import CancelPayment from './CancelPayment';
import useAxios from '../../axiosInstance'; 
import { CircularProgress, Box, Typography } from '@mui/material';

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
            try {
                // Pass order_id and success status in the request body
                const response = await axiosInstance.post('/orders/verify', { order_id, success: searchParams.get('success') === 'true' });
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
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
                <CircularProgress />
                <Typography variant="body1" sx={{ mt: 2 }}>Verifying payment...</Typography>
            </Box>
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