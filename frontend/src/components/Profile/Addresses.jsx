import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../../context/AuthContext';
import Footer from '../Footer';
import Navbar from '../Navbar';
import ProfileSidebar from './ProfileSidebar';
import { BrownOutlinedTextField } from '../../assets/CustomComponents';

const Addresses = () => {
    // TODO
    return (
        <>
            <Navbar />
            <Box className="container mx-auto max-w-4xl flex">
                <ProfileSidebar />
                <main className="flex-grow ml-0 p-4">
                    <div className="container max-w-4xl mx-auto mt-20 mb-20">
                        <div className="bg-white shadow-lg rounded-sm p-8">
                            <Typography variant="h5" className="!mb-6 !text-gray-800 !font-semibold">Addresses</Typography>
                            <form className="space-y-6">
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

export default Addresses;
