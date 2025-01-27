import { CircularProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useAxios from '../../utils/axiosInstance';
import CancelPayment from './CancelPayment';
import SuccessPayment from './SuccessPayment';

const Verify = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const session_id = searchParams.get('session_id');
    const order_id = searchParams.get('order_id');
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const axiosInstance = useAxios();

    useEffect(() => {
        const verifyPayment = async () => {
            const data = {
                order_id,
                success: searchParams.get('success') === 'true'
            };

            try {
                const response = await axiosInstance.post('/orders/verify', data);

                setSuccess(response.data.success);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (session_id && order_id) {
            verifyPayment();
        } else {
            console.error('Missing required parameters');
            setLoading(false);
        }
    }, [session_id, order_id, axiosInstance]);

    if (loading) {
        return <CircularProgress />;
    }

    return success ? <SuccessPayment /> : <CancelPayment />;
};

export default Verify;