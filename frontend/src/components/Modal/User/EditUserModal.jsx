import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ActionButtons, CustomBox, CustomModal, CustomTextField, CustomTypography, handleApiError, OutlinedBrownFormControl } from '../../../assets/CustomComponents';
import { getRolesService } from '../../../services/roleService';
import { editUserService } from '../../../services/userService';
import { UserValidations } from '../../../utils/validations/user';

const EditUserModal = ({ open, onClose, user, onViewDetails, onEditSuccess }) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('');
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);

    const validateFirstName = (v) => UserValidations.firstNameRules.pattern.test(v);
    const validateLastName = (v) => UserValidations.lastNameRules.pattern.test(v);
    const validateEmail = (v) => UserValidations.emailRules.pattern.test(v);
    const validatePassword = (v) => UserValidations.passwordRules.pattern.test(v);

    const isFormValid =
        firstName &&
        validateFirstName(firstName) &&
        lastName &&
        validateLastName(lastName) &&
        email &&
        validateEmail(email) &&
        role &&
        (password === '' || validatePassword(password));

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await getRolesService();
                setRoles(response.data);
            } catch (error) {
                console.error('Error fetching roles', error);
                toast.error('Failed to fetch roles');
            }
        };

        fetchRoles();
    }, []);

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName);
            setLastName(user.lastName);
            setEmail(user.email);
            setRole(user.role._id);
            setPassword('');
        }
    }, [user]);

    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    const handleEditUser = async () => {
        setLoading(true);

        if (!validateEmail(email)) {
            toast.error('Please enter a valid email address');
            return;
        }

        try {
            const updatedData = {
                firstName,
                lastName,
                email,
                role,
            };

            if (password.trim()) {
                updatedData.password = password;
            }

            const response = await editUserService(user._id, updatedData);
            toast.success(response.data.message);
            onEditSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error updating user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Edit User</CustomTypography>

                <CustomTextField
                    label="First Name"
                    value={firstName}
                    setValue={setFirstName}
                    validate={validateFirstName}
                    validationRule={UserValidations.firstNameRules}
                />

                <CustomTextField
                    label="Last Name"
                    value={lastName}
                    setValue={setLastName}
                    validate={validateLastName}
                    validationRule={UserValidations.lastNameRules}
                />

                <CustomTextField
                    label="Email"
                    value={email}
                    setValue={setEmail}
                    validate={validateEmail}
                    validationRule={UserValidations.emailRules}
                />

                <CustomTextField
                    label="Password"
                    value={password}
                    type={showPassword ? "text" : "password"}
                    setValue={setPassword}
                    validate={password ? validatePassword : () => true}
                    validationRule={UserValidations.passwordRules}
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
                />

                <OutlinedBrownFormControl fullWidth className="!mb-4">
                    <InputLabel>Role</InputLabel>
                    <Select
                        label="Role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        {roles.map((role) => (
                            <MenuItem key={role._id} value={role._id}>
                                {role.name}
                            </MenuItem>
                        ))}
                    </Select>
                </OutlinedBrownFormControl>

                <ActionButtons
                    primaryButtonLabel="Save"
                    secondaryButtonLabel="View Details"
                    onPrimaryClick={handleEditUser}
                    onSecondaryClick={() => {
                        onViewDetails(user);
                        onClose();
                    }}
                    primaryButtonProps={{
                        disabled: !isFormValid || loading
                    }}
                    loading={loading}
                />
            </CustomBox>
        </CustomModal>
    );
};

export default EditUserModal;