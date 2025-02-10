import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, IconButton, InputAdornment, TextField, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrownButton, BrownOutlinedTextField, Header, knownEmailProviders, LoadingDetails, LoadingLabel, ProfileLayout, TwoFactorButton } from '../../assets/CustomComponents';
import { downloadUserData } from '../../assets/DataExport';
import { profileBoxSx } from '../../assets/sx';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Utils/Footer';
import { disable2faService, enable2faService } from '../../services/authService';
import { loadUser, updateUserProfile } from '../../store/actions/authActions';

const ProfileDetails = () => {
    const { user, loading } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [initialData, setInitialData] = useState({ firstName: '', lastName: '', email: '' });
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [is2faOn, setIs2faOn] = useState(user?.twoFactorEnabled || false);
    const [is2faLoading, setIs2faLoading] = useState(false);

    const [firstNameValid, setFirstNameValid] = useState(true);
    const [lastNameValid, setLastNameValid] = useState(true);
    const [emailValid, setEmailValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);
    const [newPasswordValid, setNewPasswordValid] = useState(true);

    const [focusedField, setFocusedField] = useState(null);

    useEffect(() => {
        if (user) {
            setInitialData({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            });
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setEmail(user.email);
            setIs2faOn(user.twoFactorEnabled || false);
        }
    }, [user]);

    const enableTwoFactor = async () => {
        setIs2faLoading(true);

        try {
            const response = await enable2faService();

            if (response.data.success) {
                toast.success(response.data.message);
                navigate('/verify-otp', { state: { email: response.data.email, action: 'enable' } });
            } else {
                toast.error(response.data.message || 'Failed to enable 2FA');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to enable 2FA');
        } finally {
            setIs2faLoading(false);
        }
    };

    const disableTwoFactor = async () => {
        console.log('Disabling 2FA');
        setIs2faLoading(true);

        try {
            const response = await disable2faService();
            console.log('Disable 2FA response:', response);

            if (response.data.disableOtpPending) {
                toast.success(response.data.message);
                console.log('Redirecting to OTP verification page');
                console.log('Navigation State:', { email: user.email, action: 'disable' }); // Debugging
                navigate('/verify-otp', { state: { email: user.email, action: 'disable' } });
            } else if (response.data.success) {
                toast.success('Two-factor authentication disabled successfully.');
                console.log('2FA disabled successfully');
                setIs2faOn(false);
                dispatch(loadUser());
            }
        } catch (error) {
            console.error('Error disabling 2FA:', error);
            toast.error(error.response?.data?.message || 'Failed to disable 2FA');
        } finally {
            setIs2faLoading(false);
            console.log('2FA state:', is2faOn ? 'enabled' : 'disabled');
        }
    };

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const validateFirstName = (name) => /^[A-Z][a-zA-Z]{1,9}$/.test(name);
    const validateLastName = (name) => /^[A-Z][a-zA-Z]{1,9}$/.test(name);
    const validatePassword = (v) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\(\)_\+\-.])[A-Za-z\d@$!%*?&\(\)_\+\-.]{8,}$/.test(v);
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

    const handleNewPasswordChange = (e) => {
        const value = e.target.value;
        setNewPassword(value);
        setNewPasswordValid(validatePassword(value));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsSubmitting(true);

        const updatedData = {};
        if (firstName !== initialData.firstName) updatedData.firstName = firstName;
        if (lastName !== initialData.lastName) updatedData.lastName = lastName;
        if (email !== initialData.email) updatedData.email = email;
        if (newPassword) updatedData.newPassword = newPassword;
        if (password) updatedData.password = password;

        if (Object.keys(updatedData).length === 0) {
            toast.info('No changes detected');
            return;
        }

        try {
            const result = await dispatch(updateUserProfile(updatedData));

            if (result.success) {
                toast.success('Profile updated successfully!');
            } else {
                toast.error(result.error || 'Profile update failed');
            }
        } catch (error) {
            toast.error('Profile update failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = (
        firstNameValid && lastNameValid && emailValid &&
        (password ? passwordValid : true) &&
        (newPassword ? newPasswordValid : true)
    );

    const isFormUnchanged = (
        firstName === initialData.firstName &&
        lastName === initialData.lastName &&
        email === initialData.email &&
        !newPassword &&
        !password
    );

    const handleDownloadUserData = () => {
        if (user) {
            downloadUserData(user);
        }
    };

    const isGoogleLogin = Boolean(user?.googleId);
    const isFacebookLogin = Boolean(user?.facebookId);
    const isDisabled = isGoogleLogin || isFacebookLogin;

    const provider = isGoogleLogin && isFacebookLogin
        ? 'Google or Facebook'
        : isGoogleLogin
            ? 'Google'
            : isFacebookLogin
                ? 'Facebook'
                : '';

    const title = isDisabled
        ? `Profile details cannot be changed because you've logged in using ${provider}.`
        : '';

    const isSubmitDisabled = isFormUnchanged || !isFormValid || isSubmitting;

    return (
        <>
            <Navbar />
            <ProfileLayout>

                <Header
                    title="Profile Details"
                    isUserData={true}
                    onDownloadUserData={handleDownloadUserData}
                />

                <Tooltip title={title} placement="top" arrow>
                    <Box
                        sx={{
                            p: { xs: 3, md: 3 },
                        }}
                        className="bg-white rounded-md shadow-sm mb-4"
                    >
                        {loading ? (
                            <LoadingDetails />
                        ) : (
                            <form onSubmit={handleSubmit}>
                                <Box sx={profileBoxSx}>
                                    <div className="relative flex-grow">
                                        <TextField
                                            fullWidth
                                            label="First Name"
                                            variant="outlined"
                                            name="firstName"
                                            value={firstName}
                                            onChange={handleFirstNameChange}
                                            onFocus={() => setFocusedField('firstName')}
                                            onBlur={() => setFocusedField(null)}
                                            InputLabelProps={{ className: 'text-gray-700' }}
                                            InputProps={{ className: 'text-gray-700' }}
                                            disabled={isDisabled}
                                        />
                                        {focusedField === 'firstName' && !firstNameValid && (
                                            <div className="absolute left-0 bottom-[-78px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10">
                                                <span className="block text-xs font-semibold mb-1">Invalid First Name</span>
                                                Must start with a capital letter and be 2 to 10 characters long.
                                                <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative flex-grow">
                                        <TextField
                                            fullWidth
                                            label="Last Name"
                                            variant="outlined"
                                            name="lastName"
                                            value={lastName}
                                            onChange={handleLastNameChange}
                                            onFocus={() => setFocusedField('lastName')}
                                            onBlur={() => setFocusedField(null)}
                                            InputLabelProps={{ className: 'text-gray-700' }}
                                            InputProps={{ className: 'text-gray-700' }}
                                            disabled={isDisabled}
                                        />
                                        {focusedField === 'lastName' && !lastNameValid && (
                                            <div className="absolute left-0 bottom-[-78px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10">
                                                <span className="block text-xs font-semibold mb-1">Invalid Last Name</span>
                                                Must start with a capital letter and be 2 to 10 characters long.
                                                <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative flex-grow">
                                        <TextField
                                            fullWidth
                                            label="Email"
                                            variant="outlined"
                                            type="email"
                                            name="email"
                                            value={email}
                                            onChange={handleEmailChange}
                                            onFocus={() => setFocusedField('email')}
                                            onBlur={() => setFocusedField(null)}
                                            InputLabelProps={{ className: 'text-gray-700' }}
                                            InputProps={{ className: 'text-gray-700' }}
                                            disabled={isDisabled}
                                        />
                                        {focusedField === 'email' && !emailValid && (
                                            <div className="absolute left-0 bottom-[-58px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10">
                                                <span className="block text-xs font-semibold mb-1">Invalid Email</span>
                                                Please provide a valid email address.
                                                <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
                                            </div>
                                        )}
                                    </div>
                                </Box>

                                <Box sx={profileBoxSx}>
                                    <div className="relative flex-grow">
                                        <BrownOutlinedTextField
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="password"
                                            label="Current Password"
                                            placeholder='Required to save changes'
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            autoComplete="current-password"
                                            value={password}
                                            onChange={handlePasswordChange}
                                            onFocus={() => setFocusedField('password')}
                                            onBlur={() => setFocusedField(null)}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle current password visibility"
                                                            onClick={handleClickShowPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <Visibility className="text-stone-500" /> : <VisibilityOff className="text-stone-500" />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            disabled={isDisabled}
                                        />
                                        {focusedField === 'password' && !passwordValid && (
                                            <div className="absolute left-0 bottom-[-70px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10">
                                                <span className="block text-xs font-semibold mb-1">Invalid Password</span>
                                                Must be 8 characters long with uppercase, lowercase, number, and special character.
                                                <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative flex-grow">
                                        <BrownOutlinedTextField
                                            variant="outlined"
                                            margin="normal"
                                            fullWidth
                                            name="newPassword"
                                            label="New Password"
                                            placeholder='Leave blank to keep current password'
                                            type={showNewPassword ? 'text' : 'password'}
                                            id="new-password"
                                            value={newPassword}
                                            onChange={handleNewPasswordChange}
                                            onFocus={() => setFocusedField('newPassword')}
                                            onBlur={() => setFocusedField(null)}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle new password visibility"
                                                            onClick={handleClickShowNewPassword}
                                                            onMouseDown={handleMouseDownPassword}
                                                            edge="end"
                                                        >
                                                            {showNewPassword ? <Visibility className="text-stone-500" /> : <VisibilityOff className="text-stone-500" />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            disabled={isDisabled}
                                        />
                                        {focusedField === 'newPassword' && !newPasswordValid && (
                                            <div className="absolute left-0 bottom-[-70px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10">
                                                <span className="block text-xs font-semibold mb-1">Invalid New Password</span>
                                                Must be 8 characters long with uppercase, lowercase, number, and special character.
                                                <div className="absolute top-[-5px] left-[20px] w-0 h-0 border-l-[5px] border-r-[5px] border-b-[5px] border-transparent border-b-white"></div>
                                            </div>
                                        )}
                                    </div>
                                </Box>

                                <BrownButton
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={isSubmitDisabled}
                                    className='w-1/6 !mt-2'
                                >
                                    <LoadingLabel loading={isSubmitting} defaultLabel="Update" loadingLabel="Updating" />
                                </BrownButton>
                            </form>
                        )}
                    </Box>
                </Tooltip>

                <Box
                    sx={{
                        p: { xs: 3, md: 3 }
                    }}
                    className="bg-white rounded-md shadow-sm mb-5 !p-5"
                >
                    {loading ? (
                        <LoadingDetails />
                    ) : (
                        <>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <h2 className="text-base">Two-Factor Authentication</h2>
                                    <p className={`text-sm bg-stone-50 rounded-md px-2 ${is2faOn ? 'text-green-500' : 'text-red-500'}`}>
                                        {is2faOn ? 'Enabled' : 'Disabled'}
                                    </p>
                                </div>
                                <TwoFactorButton
                                    is2faOn={is2faOn}
                                    is2faLoading={is2faLoading}
                                    onClick={is2faOn ? disableTwoFactor : enableTwoFactor}
                                />
                            </div>
                            <p className="mt-2 text-sm text-gray-600">
                                You'll need to verify an OTP code sent to your email each login for added security.
                            </p>
                        </>
                    )}
                </Box>
            </ProfileLayout >
            <Footer />
        </>
    );
};

export default ProfileDetails;