import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoadingOverlay } from '../../components/custom/LoadingSkeletons';
import { clearCartService } from '../../services/cartService';
import { verifyStripeOrderService } from '../../services/orderService';
import PaymentStatus from './PaymentStatus';

const Verify = () => {
    const location = useLocation();
    const navigate = useNavigate();
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

                if (!response?.data?.sessionValid) {
                    navigate('/', { replace: true });
                    return;
                }

                if (response.data.success) {
                    setSuccess(true);
                    await clearCartService();
                } else {
                    setSuccess(false);
                }
            } catch {
                navigate('/', { replace: true });
            } finally {
                setLoading(false);
            }
        };

        if (session_id && order_id) {
            verifyPayment();
        } else {
            navigate('/', { replace: true });
        }
    }, [session_id, order_id, navigate]);

    if (loading) return <LoadingOverlay />;

    return <PaymentStatus success={success} orderId={order_id} />;
};

export default Verify;