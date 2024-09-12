import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, Container, IconButton, InputAdornment, Paper, Typography } from '@mui/material';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField } from '../../assets/CustomComponents';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!usernameOrEmail || !password) {
            toast.error('Please fill in all fields');
            return;
        }
        const response = await login(usernameOrEmail, password);
        response.success ? navigate('/') : toast.error(response.message);
    };

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'neutral.50' }}>
            <Navbar />
            <Container component="main" maxWidth="xs" sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'left', mt: 10, mb: 10 }}>
                <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'left', borderRadius: 2, boxShadow: '20px 20px 60px #d9d9d9, -20px -20px 60px #ffffff', background: 'linear-gradient(145deg, #ffffff, #f0f0f0)' }}>
                    <Typography component="h1" variant="h4" align='left' sx={{ mb: 2, color: 'text.secondary', fontWeight: 'bold' }}>
                        Welcome Back
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
                        <BrownOutlinedTextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="usernameOrEmail"
                            label="Username or Email"
                            value={usernameOrEmail}
                            onChange={(e) => setUsernameOrEmail(e.target.value)}
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
                            Don't have an account? <a href='/register' className='font-bold cursor-pointer hover:underline'>Sign Up</a>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
            <Footer />
        </Box>
    );
};

export default Login;