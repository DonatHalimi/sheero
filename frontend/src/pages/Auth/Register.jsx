import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Container, IconButton, InputAdornment, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, ErrorTooltip, handleFacebookLogin, handleGoogleLogin, knownEmailProviders, LoadingLabel, SocialLoginButtons } from '../../assets/CustomComponents';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Utils/Footer';
import { registerUser } from '../../store/actions/authActions';
import { UserValidations } from '../../utils/validations/user';

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
        if (name === 'firstName') {
            return UserValidations.firstNameRules.pattern.test(value);
        } else if (name === 'lastName') {
            return UserValidations.lastNameRules.pattern.test(value);
        } else if (name === 'email') {
            return UserValidations.emailRules.pattern.test(value);
        } else if (name === 'password') {
            return UserValidations.passwordRules.pattern.test(value);
        }
        return true;
    };

    const errorMessages = {
        firstName: {
            title: UserValidations.firstNameRules.title,
            details: UserValidations.firstNameRules.message
        },
        lastName: {
            title: UserValidations.lastNameRules.title,
            details: UserValidations.lastNameRules.message
        },
        email: {
            title: UserValidations.emailRules.title,
            details: UserValidations.emailRules.message
        },
        password: {
            title: UserValidations.passwordRules.title,
            details: UserValidations.passwordRules.message
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
                            disabled={!isFormValid || loading}
                            sx={{ mb: 2 }}
                        >
                            <LoadingLabel loading={loading} defaultLabel='Register' loadingLabel='Registering' />
                        </BrownButton>
                        <div className='text-left text-sm text-stone-500'>
                            Already have an account?{' '}
                            <span
                                onClick={() => navigate('/login')}
                                role="button"
                                className="font-bold cursor-pointer hover:underline"
                            >
                                Log In
                            </span>
                        </div>

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