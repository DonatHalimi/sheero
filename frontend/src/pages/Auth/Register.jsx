import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, Container, IconButton, InputAdornment, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, knownEmailProviders } from '../../assets/CustomComponents';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Utils/Footer';
import { registerUser } from '../../store/actions/authActions';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [firstNameValid, setFirstNameValid] = useState(true);
    const [lastNameValid, setLastNameValid] = useState(true);
    const [emailValid, setEmailValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);
    const [focusedField, setFocusedField] = useState(null);

    useEffect(() => { window.scrollTo(0, 0); }, []);

    const handleClickShowPassword = () => setShowPassword(prev => !prev);
    const handleMouseDownPassword = event => event.preventDefault();

    const validateFirstName = (name) => /^[A-Z][a-zA-Z]{1,9}$/.test(name);
    const validateLastName = (name) => /^[A-Z][a-zA-Z]{1,9}$/.test(name);
    const validatePassword = password => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

    const validateEmail = (email) => {
        const regex = new RegExp(`^[a-zA-Z0-9._%+-]+@(${knownEmailProviders.join('|')})$`, 'i');
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

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        setPasswordValid(validatePassword(value));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            firstName,
            lastName,
            email,
            password
        };

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
            const response = await dispatch(registerUser(userData));

            if (response?.success) {
                toast.success('Registration successful, please log in');
                navigate('/login');
            } else if (response?.errors) {
                response.errors.forEach(err => {
                    toast.info(`${err.message}`);
                });
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('An error occurred during registration');
        }
    }

    const isFormValid = firstNameValid && lastNameValid && emailValid && passwordValid && firstName && lastName && email && password;

    return (
        <Box className='flex flex-col bg-neutral-50 min-h-[100vh]'>
            <Navbar />
            <Container component="main" maxWidth="xs" className='flex flex-1 flex-col align-left mt-20 mb-20'>
                <div className='bg-white flex flex-col align-left rounded-md shadow-md p-6'>
                    <Typography variant="h5" align='left' className='mb-2 font-extrabold text-stone-600'>
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
                                error={!firstNameValid}
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
                                error={!lastNameValid}
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
                                error={!emailValid}
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