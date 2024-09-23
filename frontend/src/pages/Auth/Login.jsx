import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, Container, IconButton, InputAdornment, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField } from '../../assets/CustomComponents';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar/Navbar';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }
        const response = await login(email, password);
        response.success ? navigate('/') : toast.error(response.message);
    };

    return (
        <Box className='flex flex-col bg-neutral-50 min-h-[100vh]'>
            <Navbar />
            <Container component="main" maxWidth="xs" className='flex flex-1 flex-col align-left mt-20 mb-20'>
                <div className='bg-white flex flex-col align-left rounded-md shadow-md p-6'>
                    <Typography variant="h4" align='left' className='mb-2 font-extrabold text-stone-600'>
                        Welcome Back
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate className='w-full'>
                        <BrownOutlinedTextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <BrownOutlinedTextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 3 }}
                        />
                        <BrownButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mb: 2 }}
                        >
                            Log In
                        </BrownButton>
                        <Typography variant="body2" align="left" sx={{ color: 'text.secondary' }}>
                            Don't have an account?{' '} <span onClick={() => navigate('/register')} role="button" className='font-bold cursor-pointer hover:underline'> Sign Up</span>
                        </Typography>
                    </Box>
                </div>
            </Container>
            <Footer />
        </Box>
    );
};

export default Login;