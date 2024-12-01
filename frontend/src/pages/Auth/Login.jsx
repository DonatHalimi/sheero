import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, Container, IconButton, InputAdornment, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, knownEmailProviders } from '../../assets/CustomComponents';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Utils/Footer';
import { loginUser } from '../../store/actions/authActions';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [emailValid, setEmailValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);
    const [focusedField, setFocusedField] = useState(null);

    const auth = useSelector((state) => state.auth);

    useEffect(() => {
        if (auth.isAuthenticated) {
            toast.success('Login successful');
            navigate('/');
        }
    }, [auth.isAuthenticated, navigate]);

    useEffect(() => { window.scrollTo(0, 0) }, []);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const validateEmail = (email) => {
        const regex = new RegExp(`^[a-zA-Z0-9._%+-]+@(${knownEmailProviders.join('|')})$`, 'i');
        return regex.test(email);
    };

    const validatePassword = (password) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setEmailValid(validateEmail(value));
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordValid(validatePassword(value));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        }
        if (!emailValid) {
            toast.error('Invalid email format');
            return;
        }
        if (!passwordValid) {
            toast.error('Password does not meet requirements');
            return;
        }

        try {
            const response = await dispatch(loginUser(email, password));

            if (response?.success) {
                toast.success('Login successful')
            } else if (response?.errors) {
                response.errors.forEach(err => {
                    toast.info(`${err.message}`);
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error('An error occured during login');
        }
    };

    const isFormValid = emailValid && passwordValid && email && password;

    return (
        <Box className='flex flex-col bg-neutral-50 min-h-[100vh]'>
            <Navbar />
            <Container component="main" maxWidth="xs" className='flex flex-1 flex-col align-left mt-20 mb-20'>
                <div className='bg-white flex flex-col align-left rounded-md shadow-md p-6'>
                    <Typography variant="h5" align='left' className='mb-2 font-extrabold text-stone-600'>
                        Welcome Back
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate className='w-full'>
                        <div className="relative">
                            <BrownOutlinedTextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                value={email}
                                onChange={handleEmailChange}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                error={!emailValid}
                            />
                            {focusedField === 'email' && !emailValid && (
                                <div className="absolute left-0 bottom-[-50px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10">
                                    <span className="block text-xs font-semibold mb-1">Invalid Email</span>
                                    Please provide a valid email address.
                                    <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
                                </div>
                            )}
                        </div>

                        <div className="relative">
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
                                onChange={handlePasswordChange}
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField(null)}
                                error={!passwordValid}
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
                            {focusedField === 'password' && !passwordValid && (
                                <div className="absolute left-0 bottom-[-54px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10">
                                    <span className="block text-xs font-semibold mb-1">Invalid Password</span>
                                    Must be 8 characters long with uppercase, lowercase, number, and special character.
                                    <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
                                </div>
                            )}
                        </div>

                        <BrownButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mb: 2 }}
                            disabled={!isFormValid}
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