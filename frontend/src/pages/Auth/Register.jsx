import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, Container, IconButton, InputAdornment, Paper, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField } from '../../assets/CustomComponents';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleClickShowPassword = () => setShowPassword(prev => !prev);
    const handleMouseDownPassword = event => event.preventDefault();

    const validatePassword = password => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    const validateEmail = email => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.toLowerCase());

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !email || !password) {
            return toast.error('Please fill in all fields');
        }
        if (!validateEmail(email)) {
            return toast.error('Invalid email format');
        }
        if (!validatePassword(password)) {
            return toast.error('Password must be at least 8 characters long, with one uppercase letter, one lowercase letter, one number, and one special character');
        }
        try {
            const response = await register(username, email, password);
            if (response.success) {
                toast.success('Registration successful');
                navigate('/login');
            } else {
                toast.error(response.message || 'Registration failed');
            }
        } catch (error) {
            toast.error('An error occurred during registration');
            console.error('Registration error:', error);
        }
    };

    return (
        <Box className='bg-neutral-50' sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Container component="main" maxWidth="xs" sx={{ flex: 1, display: 'flex', mt: 10, mb: 10 }}>
                <Paper elevation={3} sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'left',
                    width: '100%',
                    borderRadius: 2,
                    background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                    boxShadow: '20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff',
                }}>
                    <Typography component="h1" variant="h4" align='left' sx={{ mb: 2, color: 'text.secondary', fontWeight: 'bold' }}>
                        Join Us
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
                        <BrownOutlinedTextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            value={username}
                            autoComplete="username"
                            autoFocus
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <BrownOutlinedTextField
                            margin='normal'
                            required
                            fullWidth
                            id='email'
                            label="Email"
                            value={email}
                            autoComplete='email'
                            onChange={(e) => setEmail(e.target.value)}
                            type='email'
                        />
                        <BrownOutlinedTextField
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            label="Password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
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
                            Register
                        </BrownButton>
                        <Typography variant="body2" align="left" sx={{ color: 'text.secondary' }}>
                            Already have an account? <a href='/login' className='font-bold cursor-pointer hover:underline'>Log In</a>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
            <Footer />
        </Box>
    );
};

export default Register;
