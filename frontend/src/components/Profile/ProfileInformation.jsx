import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, Button, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrownOutlinedTextField } from '../../assets/CustomComponents';
import { AuthContext } from '../../context/AuthContext';
import Footer from '../Footer';
import Navbar from '../Navbar';
import ProfileSidebar from './ProfileSidebar';

const ProfileInformation = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        username: auth.username || '',
        email: auth.email || '',
        password: '',
        newPassword: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedData = {};
            if (formData.username !== auth.username) updatedData.username = formData.username;
            if (formData.email !== auth.email) updatedData.email = formData.email;
            if (formData.newPassword) updatedData.newPassword = formData.newPassword;

            if (Object.keys(updatedData).length > 0) {
                updatedData.password = formData.password;
            } else {
                toast.info('No changes detected');
                return;
            }

            const response = await axios.put('http://localhost:5000/api/auth/profile', updatedData, {
                headers: {
                    Authorization: `Bearer ${auth.accessToken}`,
                },
            });

            const newAuth = {
                ...auth,
                username: response.data.username,
                email: response.data.email,
                accessToken: response.data.accessToken || auth.accessToken
            };
            setAuth(newAuth);

            if (updatedData.username !== undefined) {
                localStorage.setItem('username', updatedData.username);
            }
            if (updatedData.email !== undefined) {
                localStorage.setItem('email', updatedData.email);
            }

            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Profile update failed:', error);

            if (error.response) {
                toast.error(error.response.data.message || 'Profile update failed');
            } else if (error.request) {
                console.error('Request data:', error.request);
                toast.error('No response received from server');
            } else {
                console.error('Error message:', error.message);
                toast.error('Error occurred while updating profile');
            }
        }
    };

    // Function to determine if the user is adding new information
    const isAddingNewInformation = () => {
        return formData.username !== auth.username || formData.email !== auth.email;
    };

    return (
        <>
            <Navbar />
            <Box className="container mx-auto max-w-4xl flex">
                <ProfileSidebar />
                <main className="p-4 relative left-24 w-full">
                    <div className="container max-w-6xl mx-auto mt-20 mb-36">
                        <div className="bg-white shadow-lg rounded-sm p-8">
                            <Typography variant="h5" className="!mb-6 !text-gray-800 !font-semilight">Personal Information</Typography>
                            <form onSubmit={handleSubmit} className="space-y-2">
                                <Box className="flex gap-4">
                                    <TextField
                                        fullWidth
                                        label="Username"
                                        variant="outlined"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        InputLabelProps={{ className: 'text-gray-700' }}
                                        InputProps={{ className: 'text-gray-700' }}
                                    />
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        variant="outlined"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        InputLabelProps={{ className: 'text-gray-700' }}
                                        InputProps={{ className: 'text-gray-700' }}
                                    />
                                </Box>

                                <Box className="flex gap-4">
                                    <BrownOutlinedTextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Current Password"
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        autoComplete="current-password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle current password visibility"
                                                        onClick={handleClickShowPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityIcon className='text-stone-500' /> : <VisibilityOffIcon className='text-stone-500' />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                    <BrownOutlinedTextField
                                        variant="outlined"
                                        margin="normal"
                                        fullWidth
                                        name="newPassword"
                                        label="New Password"
                                        type={showNewPassword ? "text" : "password"}
                                        id="new-password"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle new password visibility"
                                                        onClick={handleClickShowNewPassword}
                                                        onMouseDown={handleMouseDownPassword}
                                                        edge="end"
                                                    >
                                                        {showNewPassword ? <VisibilityIcon className='text-stone-500' /> : <VisibilityOffIcon className='text-stone-500' />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Box>

                                <Button type="submit" variant="contained" color="primary" className="bg-orange-600 hover:bg-orange-700">
                                    {isAddingNewInformation() ? 'Save' : 'Update'}
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

export default ProfileInformation;
