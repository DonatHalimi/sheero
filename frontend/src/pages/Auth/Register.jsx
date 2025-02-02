import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Container, IconButton, InputAdornment, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, ErrorTooltip, handleFacebookLogin, handleGoogleLogin, knownEmailProviders, LoadingOverlay, SocialLoginButtons } from '../../assets/CustomComponents';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Utils/Footer';
import { registerUser } from '../../store/actions/authActions';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [focusedField, setFocusedField] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClickShowPassword = () => setShowPassword((prev) => !prev);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const validateField = (name, value) => {
        const rules = {
            firstName: /^[A-Z][a-zA-Z]{1,9}$/,
            lastName: /^[A-Z][a-zA-Z]{1,9}$/,
            email: new RegExp(`^[a-zA-Z0-9._%+-]+@(${knownEmailProviders.join('|')})$`, 'i'),
            password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\(\)_\+\-.])[A-Za-z\d@$!%*?&\(\)_\+\-.]{8,}$/,
        };
        return rules[name]?.test(value);
    };

    const errorMessages = {
        firstName: {
            title: 'Invalid First Name',
            details: 'Must start with a capital letter and be 2 to 10 characters long.'
        },
        lastName: {
            title: 'Invalid Last Name',
            details: 'Must start with a capital letter and be 2 to 10 characters long.'
        },
        email: {
            title: 'Invalid Email',
            details: 'Please provide a valid email address.'
        },
        password: {
            title: 'Invalid Password',
            details: 'Must be 8 characters long with uppercase, lowercase, number, and special character.'
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e) => {
        setLoading(true);

        e.preventDefault();
        if (Object.values(formData).some((value) => !value)) {
            return toast.error('Please fill in all fields');
        }

        const invalidFields = Object.entries(formData).filter(
            ([name, value]) => !validateField(name, value)
        );
        if (invalidFields.length > 0) {
            return toast.error(`${invalidFields[0][0]} is invalid`);
        }

        try {
            const response = await dispatch(registerUser(formData));
            if (response?.success) {
                navigate('/verify-otp', { state: { email: response.data.email } });
            } else if (response?.errors) {
                response.errors.forEach((err) => toast.info(`${err.message}`));
            }
        } catch (error) {
            console.error('Registration error:', error);
            toast.error('An error occurred during registration');
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = Object.entries(formData).every(([name, value]) => validateField(name, value));

    return (
        <Box className="flex flex-col bg-neutral-50 min-h-[100vh]">
            {loading && <LoadingOverlay />}

            <Navbar />
            <Container component="main" maxWidth="xs" className="flex flex-1 flex-col align-left mt-20 mb-20">
                <div className="bg-white flex flex-col align-left rounded-md shadow-md p-6">
                    <Typography variant="h5" align="left" className="!mb-4 font-extrabold text-stone-600">
                        Join Us
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate className="w-full">
                        {Object.entries(formData).map(([name, value]) => (
                            <div key={name} className="relative mb-5">
                                <BrownOutlinedTextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id={name}
                                    label={
                                        name === 'firstName'
                                            ? 'First Name'
                                            : name === 'lastName'
                                                ? 'Last Name'
                                                : name.charAt(0).toUpperCase() + name.slice(1)
                                    }
                                    value={value}
                                    autoComplete={name}
                                    type={name === 'password' && !showPassword ? 'password' : 'text'}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField(name)}
                                    onBlur={() => setFocusedField(null)}
                                    error={!validateField(name, value) && !!value}
                                    InputProps={
                                        name === 'password'
                                            ? {
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                        >
                                                            {showPassword ? <Visibility /> : <VisibilityOff />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }
                                            : undefined
                                    }
                                />
                                <ErrorTooltip
                                    field={name}
                                    focusedField={focusedField}
                                    isValid={validateField(name, value)}
                                    value={value}
                                    message={errorMessages[name]}
                                />
                            </div>
                        ))}
                        <BrownButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={!isFormValid}
                            sx={{ mb: 2 }}
                        >
                            Register
                        </BrownButton>
                        <Typography variant="body2" align="left" sx={{ color: 'text.secondary' }}>
                            Already have an account?{' '}
                            <span
                                onClick={() => navigate('/login')}
                                role="button"
                                className="font-bold cursor-pointer hover:underline"
                            >
                                Log In
                            </span>
                        </Typography>

                        <SocialLoginButtons
                            handleGoogleLogin={handleGoogleLogin}
                            handleFacebookLogin={handleFacebookLogin}
                            isRegisterPage={true}
                        />
                    </Box>
                </div>
            </Container>
            <Footer />
        </Box>
    );
};

export default Register;