import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, Container, IconButton, InputAdornment, Typography, Paper } from '@mui/material';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField } from '../../components/Dashboard/CustomComponents';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !email || !password) {
            toast.error('Please fill in all fields');
            return;
        }

        if (!validateEmail(email)) {
            toast.error('Email format is not correct');
            return;
        }

        if (!validatePassword(password)) {
            toast.error('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character');
            return;
        }

        const response = await register(username, email, password);
        if (response.success) {
            toast.success('User registered successfully');
            navigate('/login');
        } else {
            if (response.message === 'User or Email already exists') {
                toast.error('Username or Email already exists');
            } else {
                toast.error(response.message || 'Registration failed');
            }
        }
    };

    return (
        <Box className='bg-neutral-50' sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <Navbar />
            <Container component="main" maxWidth="xs" sx={{
                flex: 1, display: 'flex', marginTop: '200px', marginBottom: '200px'
            }}>
                <Paper elevation={3} className='p-4 flex flex-col align-middle w-full' sx={{
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'left',
                    width: '100%',
                    borderRadius: '12px',
                    background: 'linear-gradient(145deg, #ffffff, #f0f0f0)',
                    boxShadow: '20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff',
                }}>
                    <Typography component="h1" variant="h4" align='left' className='!mb-4 !text-stone-500 !font-bold'>
                        Join Us
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
                        <Box component="form" onSubmit={handleSubmit} noValidate className="w-full">
                            <BrownOutlinedTextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                value={username}
                                name="username"
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
                                name='email'
                                autoComplete='email'
                                onChange={(e) => setEmail(e.target.value)}
                                type='email'
                            />
                            <BrownOutlinedTextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                id="password"
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
                            />
                            <BrownButton
                                type="submit"
                                fullWidth
                                variant="contained"
                                className="!mb-4 !mt-4"
                            >
                                Register
                            </BrownButton>
                            <Typography variant="body2" align="left" className='mt-2 text-stone-500'>
                                Already have an account? <a href='/login' className='text-stone-500 cursor-pointer font-bold hover:underline'>Log In</a>
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Container>
            <Footer />
        </Box >
    );
};

export default Register;