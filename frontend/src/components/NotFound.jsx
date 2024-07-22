import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { Container, Typography } from '@mui/material';
import React from 'react';
import Navbar from './Navbar';

const NotFound = () => {
    return (
        <>
            <Navbar />
            <Container
                maxWidth="sm"
                className="flex flex-col items-center justify-center h-screen text-center mt-20"
            >
                <Typography
                    variant="h1"
                    component="h1"
                    className="text-6xl font-bold mb-4 text-red-600"
                >
                    <ErrorOutlineOutlinedIcon fontSize='large'
                        sx={{
                            position: 'relative',
                            bottom: '2px'
                        }} />
                    404
                </Typography>
                <Typography
                    variant="h5"
                    component="h2"
                    className="mb-6 text-gray-700"
                >
                    Oops! The page you’re looking for doesn’t exist.
                </Typography>
            </Container>
        </>
    );
};

export default NotFound;