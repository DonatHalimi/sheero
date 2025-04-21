import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessPayment = ({ orderId }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate(`/profile/orders/${orderId}`, { replace: true });
        }, 4000);

        return () => clearTimeout(timer);
    }, [navigate, orderId]);

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
                transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                    duration: 1.5
                }}
                style={{ marginBottom: '1rem' }}
            >
                <CheckCircleIcon color="success" style={{ fontSize: 50 }} />
            </motion.div>

            <Typography variant="h4" fontWeight="bold" color="success" gutterBottom>
                Payment Successful!
            </Typography>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <Typography variant="body1" fontWeight="500" color="textSecondary">
                    Redirecting to your orders...
                </Typography>
            </motion.div>
        </Box>
    );
};

export default SuccessPayment;