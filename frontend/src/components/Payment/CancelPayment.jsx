import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircularProgress, Typography, Box } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';

const CancelPayment = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prevCount) => {
                if (prevCount === 1) {
                    clearInterval(timer);
                    navigate('/profile/orders');
                }
                return prevCount - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
        >
            <CancelIcon color="error" style={{ fontSize: 64 }} />
            <Typography variant="h4" sx={{ mt: 2, mb: 4 }}>
                Payment Cancelled
            </Typography>
            <CircularProgress />
            <Typography variant="body1" sx={{ mt: 2 }}>
                Redirecting to your orders in {countdown} seconds...
            </Typography>
        </Box>
    );
};

export default CancelPayment;