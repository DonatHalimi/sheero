import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, IconButton, InputAdornment, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, OutlinedBrownFormControl } from '../../../assets/CustomComponents';
import useAxios from '../../../axiosInstance';
import { AuthContext } from '../../../context/AuthContext';

const EditUserModal = ({ open, onClose, user, onEditSuccess }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('');

    const { refreshToken } = useContext(AuthContext);
    const axiosInstance = useAxios(refreshToken);

    useEffect(() => {
        if (user) {
            setUsername(user.username);
            setEmail(user.email);
            setRole(user.role);
            setIsValidEmail(true);
        }
    }, [user]);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    const validateEmail = (email) => {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    };

    const handleEditUser = async () => {
        if (!validateEmail(email)) {
            toast.error('Please enter a valid email address');
            return;
        }
        try {
            const updatedData = {
                username,
                email,
                role
            };
            if (password) {
                updatedData.password = password;
            }
            await axiosInstance.put(`/users/update/${user._id}`, updatedData);
            toast.success('User updated successfully');
            onEditSuccess();
            onClose();
        } catch (error) {
            toast.error('Error updating user: ' + error.message);
            console.error('Error updating user', error);
        }
    };

    return (
        <Modal open={open} onClose={onClose} className='flex items-center justify-center'>
            <Box className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
                <Typography variant='h5' className="!text-xl !font-bold !mb-6">Edit User</Typography>
                <BrownOutlinedTextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    fullWidth
                    className='!mb-4'
                />
                <BrownOutlinedTextField
                    label="Email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setIsValidEmail(validateEmail(e.target.value));
                    }}
                    fullWidth
                    className='!mb-4'
                    type='email'
                    error={!isValidEmail}
                    helperText={!isValidEmail ? "Please enter a valid email address" : ""}
                />
                <BrownOutlinedTextField
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    className="!mb-4"
                    type={showPassword ? "text" : "password"}
                    placeholder="Leave blank to keep current password"
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
                />
                <OutlinedBrownFormControl fullWidth className="!mb-4">
                    <InputLabel>Role</InputLabel>
                    <Select
                        label="Role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </Select>
                </OutlinedBrownFormControl>
                <BrownButton
                    onClick={handleEditUser}
                    variant="contained"
                    color="primary"
                    className="w-full"
                >
                    Save Changes
                </BrownButton>
            </Box>
        </Modal >
    );
};

export default EditUserModal;