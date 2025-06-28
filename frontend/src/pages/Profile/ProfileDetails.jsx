import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, IconButton, InputAdornment, Switch, TextField, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { profileBoxSx } from '../../assets/sx';
import { LoadingDetails, LoadingLabel } from '../../components/custom/LoadingSkeletons';
import { BrownButton, BrownOutlinedTextField, DetailsBox } from '../../components/custom/MUI';
import { Header, ProfileLayout, TwoFactorButton, TwoFactorModal } from '../../components/custom/Profile';
import Navbar from '../../components/Navbar/Navbar';
import { downloadUserData } from '../../components/Product/Utils/DataExport';
import Footer from '../../components/Utils/Footer';
import { toggleLoginNotificationsService } from '../../services/authService';
import { loadUser, updateUserProfile } from '../../store/actions/authActions';
import { EMAIL_VALIDATION, FIRST_NAME_VALIDATION, LAST_NAME_VALIDATION, LOGIN_NOTIFICATIONS_VALIDATION, PASSWORD_VALIDATION, TWO_FACTOR_VALIDATION } from '../../utils/constants/user';

const ProfileDetails = () => {
    const { user, loading } = useSelector(state => state.auth);
    const dispatch = useDispatch();

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
    const [loginNotifications, setLoginNotifications] = useState(user?.loginNotifications || false);
    const [modalOpen, setModalOpen] = useState(false);

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
            setLoginNotifications(user.loginNotifications || false);
        }
    }, [user]);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

    const validateFirstName = (v) => FIRST_NAME_VALIDATION.regex.test(v);
    const validateLastName = (v) => LAST_NAME_VALIDATION.regex.test(v);
    const validateEmail = (v) => EMAIL_VALIDATION.regex.test(v);
    const validatePassword = (v) => PASSWORD_VALIDATION.regex.test(v);

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
                if (updatedData.firstName) {
                    await dispatch(loadUser());
                }
            } else {
                toast.error(result.error || 'Profile update failed');
            }
        } catch (error) {
            toast.error('Profile update failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleLoginNotifs = async () => {
        const newValue = !loginNotifications;
        try {
            const response = await toggleLoginNotificationsService(newValue);
            setLoginNotifications(response.data.loginNotifications);
            if (response.data.success) {
                await dispatch(loadUser());
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.error('Failed to toggle login notifications');
        } finally {
            setIsTogglingNotifications(false);
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
        if (user) downloadUserData(user);
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

    const title = isDisabled ? `Profile details cannot be changed because you've logged in using ${provider}` : '';

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

                <DetailsBox hasPadding={false}>
                    {loading ? (
                        <LoadingDetails />
                    ) : (
                        <Tooltip title={title} placement="top" arrow>

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
                                                <span className="block text-xs font-semibold mb-1">{FIRST_NAME_VALIDATION.title}</span>
                                                {FIRST_NAME_VALIDATION.message}
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
                                                <span className="block text-xs font-semibold mb-1">{LAST_NAME_VALIDATION.title}</span>
                                                {LAST_NAME_VALIDATION.message}
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
                                                <span className="block text-xs font-semibold mb-1">{EMAIL_VALIDATION.title}</span>
                                                {EMAIL_VALIDATION.message}
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
                                                            disabled={isDisabled}
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
                                            <div className="absolute left-0 bottom-[-90px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10">
                                                <span className="block text-xs font-semibold mb-1">{PASSWORD_VALIDATION.title}</span>
                                                {PASSWORD_VALIDATION.message}
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
                                                            disabled={isDisabled}
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
                                            <div className="absolute left-0 bottom-[-90px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10">
                                                <span className="block text-xs font-semibold mb-1">{PASSWORD_VALIDATION.title}</span>
                                                {PASSWORD_VALIDATION.message}
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
                        </Tooltip>
                    )}
                </DetailsBox>

                <DetailsBox>
                    {loading ? (
                        <LoadingDetails />
                    ) : (
                        <>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <h2 className="text-base">{TWO_FACTOR_VALIDATION.title}</h2>
                                    <p className={`text-sm bg-stone-50 rounded-md px-2 ${is2faOn ? 'text-green-500' : 'text-red-500'}`}>
                                        {is2faOn ? 'Enabled' : 'Disabled'}
                                    </p>
                                </div>
                                <TwoFactorButton onClick={() => setModalOpen(true)} />
                            </div>
                            <p className="mt-2 text-sm text-gray-600">
                                {TWO_FACTOR_VALIDATION.message}
                            </p>
                        </>
                    )}
                </DetailsBox>

                <DetailsBox>
                    {loading ? (
                        <LoadingDetails />
                    ) : (
                        <>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span>{LOGIN_NOTIFICATIONS_VALIDATION.title}</span>
                                    <p className={`text-sm bg-stone-50 rounded-md px-2 ${loginNotifications ? 'text-green-500' : 'text-red-500'}`}>
                                        {loginNotifications ? 'Enabled' : 'Disabled'}
                                    </p>
                                </div>
                                <Switch
                                    checked={loginNotifications}
                                    onChange={handleToggleLoginNotifs}
                                    color="primary"
                                />
                            </div>
                            <p className="mt-2 text-sm text-gray-600">
                                {LOGIN_NOTIFICATIONS_VALIDATION.message}
                            </p>
                        </>
                    )}
                </DetailsBox>

            </ProfileLayout >

            <TwoFactorModal open={modalOpen} onClose={() => setModalOpen(false)} />
            <Footer />
        </>
    );
};

export default ProfileDetails;