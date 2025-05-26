import { Cancel, CheckCircle } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentStatus = ({ success, orderId }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            const path = success ? `/profile/orders/${orderId}` : '/cart';
            navigate(path, { replace: true });
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate, success, orderId]);

    const Icon = success ? CheckCircle : Cancel;
    const color = success ? 'success' : 'error';
    const title = success ? 'Payment Successful!' : 'Payment Cancelled';
    const message = success ? 'Redirecting to order details...' : 'Redirecting to cart...';

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            textAlign="center"
            bgcolor="background.paper"
            px={2}
        >
            <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1.1, rotate: 360 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, duration: 1.5 }}
                style={{ marginBottom: '1rem' }}
            >
                <Icon color={color} style={{ fontSize: 50 }} />
            </motion.div>

            <Typography variant="h4" fontWeight="bold" color={color} gutterBottom>
                {title}
            </Typography>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <Typography variant="body1" fontWeight="500" color="textSecondary">
                    {message}
                </Typography>
            </motion.div>
        </Box>
    );
};

export default PaymentStatus;