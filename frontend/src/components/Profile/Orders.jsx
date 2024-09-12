import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { BrownOutlinedTextField } from '../../assets/CustomComponents';
import Footer from '../Footer';
import Navbar from '../Navbar';
import ProfileSidebar from './ProfileSidebar';

const Orders = () => {
    // TODO

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <Navbar />
            <Box className="container mx-auto max-w-4xl flex">
                <ProfileSidebar />
                <main className="p-4 relative left-32 w-full">
                    <div className="container max-w-6xl mx-auto mt-20 mb-20">
                        <div className="bg-white px-4 py-4 rounded-sm shadow-sm mb-3">
                            <Typography variant="h5" className="!text-gray-800 !font-semilight">
                                Orders
                            </Typography>
                        </div>
                        <div className="bg-white shadow-sm rounded-sm p-8">
                            <form className="space-y-6">
                                <Box className="flex gap-4">
                                    <TextField
                                        fullWidth
                                        label="Username"
                                        variant="outlined"
                                        name="username"
                                        InputLabelProps={{ className: 'text-gray-700' }}
                                        InputProps={{ className: 'text-gray-700' }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        variant="outlined"
                                        type="email"
                                        name="email"
                                        InputLabelProps={{ className: 'text-gray-700' }}
                                        InputProps={{ className: 'text-gray-700' }}
                                    />
                                </Box>
                                <BrownOutlinedTextField
                                    variant="outlined"
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Current Password"
                                    id="password"
                                    autoComplete="current-password"

                                />
                                <BrownOutlinedTextField
                                    variant="outlined"
                                    margin="normal"
                                    fullWidth
                                    name="newPassword"
                                    label="New Password"
                                    id="new-password"

                                />
                                <Button type="submit" variant="contained" color="primary" className="bg-orange-600 hover:bg-orange-700">
                                    Save
                                </Button>
                            </form>
                        </div>
                    </div>
                </main>
            </Box>
            <Footer />
        </>
    );
};

export default Orders;
