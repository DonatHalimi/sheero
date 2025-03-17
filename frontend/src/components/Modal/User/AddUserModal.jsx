import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, InputLabel, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BrownButton, CustomBox, CustomModal, CustomTextField, CustomTypography, handleApiError, LoadingLabel, OutlinedBrownFormControl } from '../../../assets/CustomComponents';
import { getRolesService } from '../../../services/roleService';
import { addUserService } from '../../../services/userService';
import { UserValidations } from '../../../utils/validations/user';

const AddUserModal = ({ open, onClose, onAddSuccess }) => {
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

    const isFormValid = firstName && validateFirstName(firstName) && lastName && validateLastName(lastName) && email && validateEmail(email) && password && validatePassword(password) && role;

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await getRolesService();
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
        setLoading(true);

        if (!firstName || !lastName || !email || !password || !role) {
            toast.error('Please fill in all the fields');
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
            const response = await addUserService(data);
            toast.success(response.data.message);
            onAddSuccess(response.data);
            onClose();
        } catch (error) {
            handleApiError(error, 'Error adding user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5">Add User</CustomTypography>

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
                    validate={validatePassword}
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
                    disabled={!isFormValid || loading}
                    className="w-full"
                >
                    <LoadingLabel loading={loading} />
                </BrownButton>
            </CustomBox>
        </CustomModal>
    );
};

export default AddUserModal;