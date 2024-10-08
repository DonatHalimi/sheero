import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, Container, IconButton, InputAdornment, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, knownEmailProviders } from '../../assets/CustomComponents';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar/Navbar';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [firstNameValid, setFirstNameValid] = useState(true);
    const [lastNameValid, setLastNameValid] = useState(true);
    const [emailValid, setEmailValid] = useState(true);
    const [focusedField, setFocusedField] = useState(null);

    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const handleClickShowPassword = () => setShowPassword(prev => !prev);
    const handleMouseDownPassword = event => event.preventDefault();

    const validateFirstName = (name) => /^[A-Z][a-zA-Z]{1,9}$/.test(name);
    const validateLastName = (name) => /^[A-Z][a-zA-Z]{1,9}$/.test(name);
    const validatePassword = password => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

    const validateEmail = (email) => {
        const providerPattern = knownEmailProviders.join('|');
        const regex = new RegExp(`^[a-zA-Z0-9._%+-]+@(${providerPattern})$`, 'i');
        return regex.test(email);
    };

    const handleFirstNameChange = (e) => {
        const value = e.target.value;
        setFirstName(value);
        setFirstNameValid(validateFirstName(value));
    };

    const handleLastNameChange = (e) => {
        const value = e.target.value;
        setLastName(value);
        setLastNameValid(validateLastName(value));
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        setEmailValid(validateEmail(value));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!firstName || !lastName || !email || !password) {
            return toast.error('Please fill in all fields');
        }
        if (!firstNameValid || !lastNameValid) {
            return toast.error('First name or last name format is incorrect');
        }
        if (!emailValid) {
            return toast.error('Invalid email format');
        }
        if (!validatePassword(password)) {
            return toast.error('Password must be at least 8 characters long, with one uppercase letter, one lowercase letter, one number, and one special character');
        }
        try {
            const response = await register(firstName, lastName, email, password);
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
        <Box className='flex flex-col bg-neutral-50 min-h-[100vh]'>
            <Navbar />
            <Container component="main" maxWidth="xs" className='flex flex-1 flex-col align-left mt-20 mb-20'>
                <div className='bg-white flex flex-col align-left rounded-md shadow-md p-6'>
                    <Typography variant="h4" align='left' className='mb-2 font-extrabold text-stone-600'>
                        Join Us
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate className='w-full'>
                        <div className="relative">
                            <BrownOutlinedTextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                value={firstName}
                                autoComplete="firstName"
                                autoFocus
                                onChange={handleFirstNameChange}
                                onFocus={() => setFocusedField('firstName')}
                                onBlur={() => setFocusedField(null)}
                            />
                            {focusedField === 'firstName' && !firstNameValid && (
                                <div className="absolute left-0 bottom-[-50px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10">
                                    <span className="block text-xs font-semibold mb-1">Invalid First Name</span>
                                    Must start with a capital letter, 2-10 characters.
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
                                id="lastName"
                                label="Last Name"
                                value={lastName}
                                autoComplete="lastName"
                                onChange={handleLastNameChange}
                                onFocus={() => setFocusedField('lastName')}
                                onBlur={() => setFocusedField(null)}
                            />
                            {focusedField === 'lastName' && !lastNameValid && (
                                <div className="absolute left-0 bottom-[-50px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10">
                                    <span className="block text-xs font-semibold mb-1">Invalid Last Name</span>
                                    Must start with a capital letter, 2-10 characters.
                                    <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
                                </div>
                            )}
                        </div>

                        <div className="relative">
                            <BrownOutlinedTextField
                                margin='normal'
                                required
                                fullWidth
                                id='email'
                                label="Email"
                                value={email}
                                autoComplete='email'
                                onChange={handleEmailChange}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField(null)}
                                type='email'
                            />
                            {focusedField === 'email' && !emailValid && (
                                <div className="absolute left-0 bottom-[-50px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10">
                                    <span className="block text-xs font-semibold mb-1">Invalid Email</span>
                                    Please provide a valid email address.
                                    <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
                                </div>
                            )}
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <BrownOutlinedTextField
                                margin="normal"
                                required
                                fullWidth
                                id="password"
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField(null)}
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
                            {focusedField === 'password' && !validatePassword(password) && (
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
                        >
                            Register
                        </BrownButton>
                        <Typography variant="body2" align="left" sx={{ color: 'text.secondary' }}>
                            Already have an account?{' '} <span onClick={() => navigate('/login')} role="button" className='font-bold cursor-pointer hover:underline'> Log In</span>
                        </Typography>
                    </Box>
                </div>
            </Container>
            <Footer />
        </Box>
    );
};

export default Register;