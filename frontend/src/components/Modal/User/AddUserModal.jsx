import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, BrownOutlinedTextField, CustomBox, CustomModal, CustomTypography, handleApiError, knownEmailProviders, OutlinedBrownFormControl } from '../../../assets/CustomComponents';
import useAxios from '../../../utils/axiosInstance';

const AddUserModal = ({ open, onClose, onAddSuccess }) => {
    const [firstName, setFirstName] = useState('');
    const [isValidFirstName, setIsValidFirstName] = useState(true);
    const [lastName, setLastName] = useState('');
    const [isValidLastName, setIsValidLastName] = useState(true);
    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [password, setPassword] = useState('');
    const [isValidPassword, setIsValidPassword] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('');
    const [roles, setRoles] = useState([]);

    const axiosInstance = useAxios();

    const validateName = (v) => /^[A-Z][a-zA-Z\s]{2,10}$/.test(v);
    const validateEmail = (v) => new RegExp(`^[a-zA-Z0-9._%+-]+@(${knownEmailProviders.join('|')})$`, 'i').test(v);
    const validatePassword = (v) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\(\)_\+\-.])[A-Za-z\d@$!%*?&\(\)_\+\-.]{8,}$/.test(v);

    const isValidForm = firstName && isValidFirstName && lastName && isValidLastName && email && isValidEmail && password && isValidPassword && role;

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axiosInstance.get('/roles/get');
                setRoles(response.data);
            } catch (error) {
                console.error('Error fetching roles', error);
            }
        };

        fetchRoles();
    }, []);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    const handleAddUser = async () => {
        if (!firstName || !lastName || !email || !password || !role) {
            toast.error('Please fill in all the fields');
            return;
        }

        if (!validateEmail(email)) {
            toast.error('Email format is not correct.');
            return;
        }

        if (!validatePassword(password)) {
            toast.error('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.');
            return;
        }

        const data = {
            firstName,
            lastName,
            email,
            password,
            role
        };

        try {
            const response = await axiosInstance.post('/users/create', data);
            toast.success(response.data.message);
            onAddSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error adding user');
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Add User</CustomTypography>

                <BrownOutlinedTextField
                    label="First Name"
                    value={firstName}
                    fullWidth
                    onChange={(e) => {
                        setFirstName(e.target.value)
                        setIsValidFirstName(validateName(e.target.value))
                    }}
                    error={!isValidFirstName}
                    helperText={!isValidFirstName ? 'First Name must start with a capital letter and be 2-10 characters long' : ''}
                    className="!mb-4"
                />
                <BrownOutlinedTextField
                    label="Last Name"
                    value={lastName}
                    fullWidth
                    onChange={(e) => {
                        setLastName(e.target.value)
                        setIsValidLastName(validateName(e.target.value))
                    }}
                    error={!isValidLastName}
                    helperText={!isValidLastName ? 'Last Name must start with a capital letter and be 2-10 characters long' : ''}
                    className="!mb-4"
                />
                <BrownOutlinedTextField
                    label="Email"
                    value={email}
                    fullWidth
                    type='email'
                    onChange={(e) => {
                        setEmail(e.target.value)
                        setIsValidEmail(validateEmail(e.target.value))
                    }}
                    error={!isValidEmail}
                    helperText={!isValidEmail ? 'Please enter a valid email address' : ''}
                    className='!mb-4'
                />
                <BrownOutlinedTextField
                    label="Password"
                    value={password}
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    InputProps={{
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
                    }}
                    onChange={(e) => {
                        setPassword(e.target.value)
                        setIsValidPassword(validatePassword(e.target.value))
                    }}
                    error={!isValidPassword}
                    helperText={!isValidPassword ? 'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?()&)' : ''}
                    className="!mb-4"
                />
                <OutlinedBrownFormControl fullWidth className="!mb-4">
                    <InputLabel>Role</InputLabel>
                    <Select
                        label="Role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        {roles.map((role) => (
                            <MenuItem key={role._id} value={role._id.toString()}>
                                {role.name}
                            </MenuItem>
                        ))}
                    </Select>
                </OutlinedBrownFormControl>

                <BrownButton
                    onClick={handleAddUser}
                    variant="contained"
                    color="primary"
                    disabled={!isValidForm}
                    className="w-full"
                >
                    Add
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddUserModal;