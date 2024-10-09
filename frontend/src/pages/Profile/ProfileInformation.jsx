import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, Button, IconButton, InputAdornment, TextField } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrownOutlinedTextField, Header, knownEmailProviders, ProfileInformationSkeleton } from '../../assets/CustomComponents';
import useAxios from '../../axiosInstance';
import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar/Navbar';
import { AuthContext } from '../../context/AuthContext';
import ProfileSidebar from './ProfileSidebar';

const ProfileInformation = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const axiosInstance = useAxios();
    const [firstName, setFirstName] = useState({ firstName: auth.firstName || '' });
    const [lastName, setLastName] = useState({ lastName: auth.lastName || '' });
    const [email, setEmail] = useState({ email: auth.email || '' });
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [firstNameValid, setFirstNameValid] = useState(true);
    const [lastNameValid, setLastNameValid] = useState(true);
    const [emailValid, setEmailValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);
    const [newPasswordValid, setNewPasswordValid] = useState(true);

    const [focusedField, setFocusedField] = useState(null);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickShowNewPassword = () => setShowNewPassword(!showNewPassword);
    const handleMouseDownPassword = (event) => event.preventDefault();

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
        setFirstName({ firstName: value });
        setFirstNameValid(validateFirstName(value));
    };

    const handleLastNameChange = (e) => {
        const value = e.target.value;
        setLastName({ lastName: value });
        setLastNameValid(validateLastName(value));
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail({ email: value });
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

    useEffect(() => window.scrollTo(0, 0), []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedData = {};
            if (firstName.firstName !== auth.firstName) updatedData.firstName = firstName.firstName;
            if (lastName.lastName !== auth.lastName) updatedData.lastName = lastName.lastName;
            if (email.email !== auth.email) updatedData.email = email.email;
            if (newPassword) updatedData.newPassword = newPassword;

            if (Object.keys(updatedData).length > 0) {
                updatedData.password = password;
            } else {
                toast.info('No changes detected');
                setLoading(false);
                return;
            }

            const response = await axiosInstance.put('/auth/profile', updatedData);

            const newAuth = {
                ...auth,
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                email: response.data.email,
                accessToken: response.data.accessToken || auth.accessToken
            };
            setAuth(newAuth);

            if (updatedData.firstName !== undefined) {
                localStorage.setItem('firstName', updatedData.firstName);
            }
            if (updatedData.lastName !== undefined) {
                localStorage.setItem('lastName', updatedData.lastName);
            }
            if (updatedData.email !== undefined) {
                localStorage.setItem('email', updatedData.email);
            }

            toast.success('Profile updated successfully!');
        } catch (error) {
            console.error('Profile update failed:', error);

            if (error.response) {
                toast.error(error.response.data.message || 'Profile update failed');
            } else if (error.request) {
                console.error('Request data:', error.request);
                toast.error('No response received from server');
            } else {
                console.error('Error message:', error.message);
                toast.error('Error occurred while updating profile');
            }
        }
        setLoading(false);
    };

    // Function to determine if the user is adding new information
    const isAddingNewInformation = () => {
        return firstName.firstName !== auth.firstName || lastName.lastName !== auth.lastName || email.email !== auth.email;
    };

    return (
        <>
            <Navbar />
            <Box className="container mx-auto max-w-5xl relative mb-16" style={{ paddingLeft: '77px' }}>
                <ProfileSidebar />
                <main className="p-4 relative left-32 w-full">
                    <div className="container max-w-6xl mx-auto mt-20 mb-36">
                        <Header title='Personal Information' />

                        <div className="bg-white shadow-sm rounded-sm p-8">
                            {loading ? (
                                <ProfileInformationSkeleton />
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-2">
                                    <Box className="flex gap-3 w-full">
                                        <div className="relative flex-grow">
                                            <TextField
                                                fullWidth
                                                label="First Name"
                                                variant="outlined"
                                                name="firstName"
                                                value={firstName.firstName}
                                                onChange={handleFirstNameChange}
                                                onFocus={() => setFocusedField('firstName')}
                                                onBlur={() => setFocusedField(null)}
                                                InputLabelProps={{ className: 'text-gray-700' }}
                                                InputProps={{ className: 'text-gray-700' }}
                                            />
                                            {focusedField === 'firstName' && !firstNameValid && (
                                                <div className="absolute left-0 bottom-[-78px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10">
                                                    <span className="block text-xs font-semibold mb-1">Invalid First Name</span>
                                                    Must start with a capital letter, 2-10 characters.
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
                                                value={lastName.lastName}
                                                onChange={handleLastNameChange}
                                                onFocus={() => setFocusedField('lastName')}
                                                onBlur={() => setFocusedField(null)}
                                                InputLabelProps={{ className: 'text-gray-700' }}
                                                InputProps={{ className: 'text-gray-700' }}
                                            />
                                            {focusedField === 'lastName' && !lastNameValid && (
                                                <div className="absolute left-0 bottom-[-78px] bg-white text-red-500 text-sm p-2 rounded-lg shadow-md w-full z-10">
                                                    <span className="block text-xs font-semibold mb-1">Invalid Last Name</span>
                                                    Must start with a capital letter, 2-10 characters.
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
                                                value={email.email}
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


                                    <Box className="flex flex-row gap-3 w-full">
                                        <div className="relative flex-grow">
                                            <BrownOutlinedTextField
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                fullWidth
                                                name="password"
                                                label="Current Password"
                                                type={showPassword ? "text" : "password"}
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
                                                                {showPassword ? <VisibilityIcon className='text-stone-500' /> : <VisibilityOffIcon className='text-stone-500' />}
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
                                                type={showNewPassword ? "text" : "password"}
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
                                                                {showNewPassword ? <VisibilityIcon className='text-stone-500' /> : <VisibilityOffIcon className='text-stone-500' />}
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

                                    <Button type="submit" variant="contained" color="primary" className="bg-orange-600 hover:bg-orange-700">
                                        {isAddingNewInformation() ? 'Save' : 'Update'}
                                    </Button>
                                </form>
                            )}
                        </div>
                    </div>
                </main>
            </Box >
            <Footer />
        </>
    );
};

export default ProfileInformation;