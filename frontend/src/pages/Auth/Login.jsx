import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Container, IconButton, InputAdornment, Typography } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { LoadingLabel } from '../../components/custom/LoadingSkeletons';
import { BrownButton, BrownOutlinedTextField, ErrorTooltip } from '../../components/custom/MUI';
import { handleFacebookLogin, handleGoogleLogin, SocialLoginButtons } from '../../components/custom/Profile';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Utils/Footer';
import { loginUser } from '../../store/actions/authActions';
import { EMAIL_VALIDATION, PASSWORD_VALIDATION } from '../../utils/constants/user';
import ForgotPassword from './ForgotPassword';

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        emailValid: true,
        passwordValid: true,
    });
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [loading, setLoading] = useState(false);
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const validateField = (name, value) => {
        if (name === 'email') {
            return EMAIL_VALIDATION.regex.test(value);
        } else if (name === 'password') {
            return PASSWORD_VALIDATION.regex.test(value);
        }
        return true;
    };

    const errorMessages = {
        email: {
            title: EMAIL_VALIDATION.title,
            details: EMAIL_VALIDATION.message
        },
        password: {
            title: PASSWORD_VALIDATION.title,
            details: PASSWORD_VALIDATION.message
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const isValid = validateField(name, value);

        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
            [`${name}Valid`]: isValid,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { email, password, emailValid, passwordValid } = formData;

        if (!email || !password) {
            toast.error('Please fill in all fields');
            setLoading(false);
            return;
        }
        if (!emailValid) {
            toast.error('Invalid email format');
            setLoading(false);
            return;
        }
        if (!passwordValid) {
            toast.error('Password does not meet requirements');
            setLoading(false);
            return;
        }

        try {
            const result = await dispatch(loginUser(email, password));

            if (result.success) {
                if (result.requires2FA) {
                    toast.success(result.message);
                    navigate('/verify-otp', {
                        state: {
                            email: result.email,
                            action: 'login',
                            twoFactorMethods: result.twoFactorMethods || [],
                            isAuthenticator: result.twoFactorMethods?.includes('authenticator') || false
                        }
                    });
                } else {
                    toast.success(result.message);
                    navigate('/');
                }
            } else if (result?.errors) {
                result.errors.forEach((err) => {
                    toast.info(`${err.message}`);
                });
            }
        } catch (error) {
            toast.error('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = formData.emailValid && formData.passwordValid && formData.email && formData.password;

    return (
        <Box className="flex flex-col bg-neutral-50 min-h-[100vh]">
            <Navbar />
            <Container component="main" maxWidth="xs" className="flex flex-1 flex-col align-left mt-20 mb-20">
                <div className="bg-white flex flex-col align-left rounded-md shadow-md p-6">
                    <Typography variant="h5" align="left" className="font-extrabold text-stone-600">
                        Welcome Back
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate className="w-full">
                        {Object.entries(formData).map(([name, value]) => {
                            if (name === 'email' || name === 'password') {
                                return (
                                    <div key={name} className="relative mb-[-4px]">
                                        <BrownOutlinedTextField
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            name={name}
                                            label={name.charAt(0).toUpperCase() + name.slice(1)}
                                            type={name === 'password' && !showPassword ? 'password' : 'text'}
                                            id={name}
                                            value={value}
                                            onChange={handleChange}
                                            onFocus={() => setFocusedField(name)}
                                            onBlur={() => setFocusedField(null)}
                                            error={!formData[`${name}Valid`]}
                                            InputProps={name === 'password' ? {
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
                                                ),
                                            } : {}}
                                        />
                                        <ErrorTooltip
                                            field={name}
                                            focusedField={focusedField}
                                            isValid={formData[`${name}Valid`]}
                                            value={value}
                                            message={errorMessages[name]}
                                            isLoginPage={true}
                                        />
                                        {name === 'password' && (
                                            <div className='text-left text-sm text-gray-500'>
                                                <span onClick={() => setForgotPasswordOpen(true)} className="cursor-pointer hover:underline">
                                                    Forgot Password?
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                            return null;
                        })}

                        <BrownButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={!isFormValid || loading}
                            sx={{ mb: 2, mt: 2 }}
                        >
                            <LoadingLabel loading={loading} defaultLabel='Log In' loadingLabel='Logging in' />
                        </BrownButton>

                        <div className='text-left text-sm text-stone-500'>
                            Don't have an account?{' '}
                            <span
                                onClick={() => navigate('/register')}
                                role="button"
                                className="font-bold cursor-pointer hover:underline"
                            >
                                Sign Up
                            </span>
                        </div>

                        <SocialLoginButtons
                            handleGoogleLogin={handleGoogleLogin}
                            handleFacebookLogin={handleFacebookLogin}
                        />
                    </Box>
                </div>
            </Container>

            <ForgotPassword open={forgotPasswordOpen} onClose={() => setForgotPasswordOpen(false)} />

            <Footer />
        </Box>
    );
};

export default Login;