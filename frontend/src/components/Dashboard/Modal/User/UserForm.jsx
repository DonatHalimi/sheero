import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, InputLabel, MenuItem, Select } from '@mui/material';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CustomBox, CustomModal, CustomTextField, CustomTypography, FormSubmitButtons, OutlinedBrownFormControl } from '../../../../assets/CustomComponents';
import { getRolesService } from '../../../../services/roleService';
import { addUserService, editUserService } from '../../../../services/userService';
import { initialValues, validationSchema } from '../../../../utils/validations/user';

const UserForm = ({
    open,
    onClose,
    user = null,
    onSuccess,
    onViewDetails = null,
    isEdit = false
}) => {
    const [roles, setRoles] = useState([]);
    const [showPassword, setShowPassword] = useState(false);

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

    const handleSubmit = async (values, { setSubmitting }) => {
        const data = {
            ...values,
            role: values.role,
        };

        if (values.password.trim()) {
            data.password = values.password.trim();
        }

        try {
            let response;

            if (isEdit) {
                response = await editUserService(user._id, data);
            } else {
                response = await addUserService(data);
            }
            toast.success(response.data.message || 'User saved successfully');
            onSuccess(response.data);
            onClose();
        } catch (error) {
            if (error.response && error.response.data && error.response.data.errors) {
                error.response.data.errors.forEach(err => {
                    toast.error(err.message);
                });
            } else {
                const errorMessage = isEdit ? 'Error updating user' : 'Error adding user';
                toast.error(errorMessage);
            }
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <CustomModal open={open} onClose={onClose}>
            <CustomBox>
                <CustomTypography variant="h5"> {isEdit ? 'Edit User' : 'Add User'}</CustomTypography>

                <Formik
                    initialValues={initialValues(user)}
                    validationSchema={validationSchema}
                    enableReinitialize
                    onSubmit={handleSubmit}
                >
                    {({ values, isValid, dirty, setFieldValue, submitForm, isSubmitting }) => {
                        const isDisabled = !isValid || !dirty || isSubmitting;

                        return (
                            <Form>
                                <CustomTextField name="firstName" label="First Name" />

                                <CustomTextField name="lastName" label="Last Name" />

                                <CustomTextField name="email" label="Email" />

                                <CustomTextField
                                    name="password"
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => setShowPassword(!showPassword)}
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
                                        name="role"
                                        label="Role"
                                        value={values.role}
                                        onChange={(e) => setFieldValue('role', e.target.value)}
                                    >
                                        {roles.map((role) => (
                                            <MenuItem key={role._id} value={role._id.toString()}>
                                                {role.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </OutlinedBrownFormControl>


                                <FormSubmitButtons
                                    isEdit={isEdit}
                                    onViewDetails={onViewDetails}
                                    submitForm={submitForm}
                                    isDisabled={isDisabled}
                                    loading={isSubmitting}
                                    item={user}
                                    onClose={onClose}
                                />
                            </Form>
                        );
                    }}
                </Formik>
            </CustomBox>
        </CustomModal>
    );
};

export default UserForm;