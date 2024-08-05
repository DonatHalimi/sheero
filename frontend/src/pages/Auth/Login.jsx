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
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!usernameOrEmail || !password) {
            toast.error('Please fill in all fields', {
                closeOnClick: true
            });
            return;
        }
        const response = await login(usernameOrEmail, password);
        if (response.success) {
            navigate('/');
        } else {
            toast.error(response.message, {
                closeOnClick: true
            });
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
                flex: 1, display: 'flex', marginTop: '150px', marginBottom: '200px'
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
                            name="usernameOrEmail"
                            autoComplete="usernameOrEmail"
                            autoFocus
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
                            type={showPassword ? "text" : "password"}
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityIcon className='text-stone-500' /> : <VisibilityOffIcon className='text-stone-500' />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            sx={{ mb: 3 }}
                        />
                        <BrownButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            className="!mb-4 !mt-2"
                        >
                            Log In
                        </BrownButton>
                        <Typography variant="body2" align="left" className='mt-2 text-stone-500'>
                            Don't have an account? <a href='/register' className='text-stone-500 cursor-pointer font-bold hover:underline'>Sign Up</a>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
            <Footer />
        </Box >
    );
};

export default Login;
