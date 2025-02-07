import { Https, Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, LoadingLabel, LoadingOverlay } from '../../assets/CustomComponents';
import { resetPasswordService, validateResetTokenService } from '../../services/authService';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordValid, setPasswordValid] = useState(true);
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [errorVisible, setErrorVisible] = useState(false);
    const [errorVisibleConfirm, setErrorVisibleConfirm] = useState(false);
    const [email, setEmail] = useState('');

    const [loading, setLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const isDisabled =
        !passwordValid ||
        password === '' ||
        confirmPassword === '' ||
        !passwordsMatch ||
        loadingSubmit

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                toast.error('Invalid or missing token');
                navigate('/login');
                return;
            }

            try {
                const res = await validateResetTokenService(token);
                console.log(res);
                setEmail(res.data.email)
                setLoading(false);
            } catch (error) {
                toast.error(error.response?.data?.message);
                navigate('/login');
            }
        };

        validateToken();
    }, [token, navigate]);

    const validatePassword = (v) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\(\)_\+\-.])[A-Za-z\d@$!%*?&\(\)_\+\-.]{8,}$/.test(v);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
        const isValid = validatePassword(value);
        setPasswordValid(isValid);
        setErrorVisible(!isValid && value !== '');
        if (confirmPassword) {
            const match = value === confirmPassword;
            setPasswordsMatch(match);
            setErrorVisibleConfirm(!match);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);
        const match = password === value;
        setPasswordsMatch(match);
        setErrorVisibleConfirm(!match && value !== '');
    };

    const handleBlur = () => {
        if (!passwordValid) {
            setErrorVisible(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingSubmit(true);

        if (!passwordValid || !passwordsMatch) {
            toast.error('Please enter a valid password and ensure both passwords match');
            setLoadingSubmit(false);
            return;
        }

        try {
            const res = await resetPasswordService(token, password);
            toast.success(res.data.message);
            navigate('/login');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Error resetting password');
        } finally {
            setLoadingSubmit(false);
        }
    };

    if (loading) {
        return <LoadingOverlay />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
                <div className="flex items-center justify-center mb-4">
                    <div className="bg-stone-100 p-3 rounded-full">
                        <Https className="w-6 h-6 text-stone-600" />
                    </div>
                </div>
                <div className="text-center mb-1">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Reset</h2>
                    <p className="text-gray-600">Set a new password for <span className="font-semibold">{email}</span></p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="relative">
                        <BrownOutlinedTextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="New Password"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={handlePasswordChange}
                            onBlur={handleBlur}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <Visibility className="text-stone-500" /> : <VisibilityOff className="text-stone-500" />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {(!passwordValid && password && errorVisible) && (
                            <div className="absolute top-[74px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10">
                                <span className="block text-xs font-semibold mb-1">Invalid Password</span>
                                Must be 8 characters long with uppercase, lowercase, number, and special character.
                                <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
                            </div>
                        )}
                    </div>

                    <div className="relative mb-3">
                        <BrownOutlinedTextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowConfirmPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {showConfirmPassword ? <Visibility className="text-stone-500" /> : <VisibilityOff className="text-stone-500" />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        {(!passwordsMatch && confirmPassword && errorVisibleConfirm) && (
                            <div className="absolute top-[74px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10">
                                <span className="block text-xs font-semibold mb-1">Invalid Passwords</span>
                                Passwords do not match.
                                <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
                            </div>
                        )}
                    </div>

                    <BrownButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={isDisabled}
                    >
                        <LoadingLabel loading={loadingSubmit} defaultLabel='Reset' loadingLabel='Saving' />
                    </BrownButton>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
