import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LoadingOverlay } from '../../assets/CustomComponents';
import { verifyStripeOrderService } from '../../services/orderService';
import CancelPayment from './CancelPayment';
import SuccessPayment from './SuccessPayment';

const Verify = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const session_id = searchParams.get('session_id');
    const order_id = searchParams.get('order_id');
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const verifyPayment = async () => {
            const data = {
                order_id,
                success: searchParams.get('success') === 'true'
            };

            try {
                const response = await verifyStripeOrderService(data);

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
    }, [session_id, order_id]);

    if (loading) {
        return <LoadingOverlay />;
    }

    return success ? <SuccessPayment orderId={order_id} /> : <CancelPayment />;
};

export default Verify;