import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrownButton, BrownOutlinedTextField, downloadUserData, Header, knownEmailProviders, LoadingInformation, ProfileLayout } from '../../assets/CustomComponents';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Utils/Footer';
import { updateUserProfile } from '../../store/actions/authActions';

const ProfileInformation = () => {
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
        }
    }, [user]);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

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

    const handleNewPasswordChange = (e) => {
        const value = e.target.value;
        setNewPassword(value);
        setNewPasswordValid(validatePassword(value));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
            console.error('Error updating profile:', error);
            toast.error('Profile update failed');
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

    return (
        <>
            <Navbar />
            <ProfileLayout>

                <Header
                    title="Profile Information"
                    isUserData={true}
                    onDownloadUserData={handleDownloadUserData}
                />

                <Box className='bg-white rounded-md shadow-sm mb-24'
                    sx={{
                        p: { xs: 3, md: 3 }
                    }}
                >
                    {loading ? (
                        <LoadingInformation />
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-1">
                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 2 } }}>
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

                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 0, md: 2 } }}>
                                <div className="relative flex-grow">
                                    <BrownOutlinedTextField
                                        variant="outlined"
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Current Password"
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
                                                        {showPassword ? <VisibilityIcon className="text-stone-500" /> : <VisibilityOffIcon className="text-stone-500" />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
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
                                                        {showNewPassword ? <VisibilityIcon className="text-stone-500" /> : <VisibilityOffIcon className="text-stone-500" />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
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
                                disabled={isFormUnchanged || !isFormValid}
                            >
                                Update
                            </BrownButton>
                        </form>
                    )}
                </Box>
            </ProfileLayout>

            <Footer />
        </>
    );
};

export default ProfileInformation;