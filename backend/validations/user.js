const yup = require('yup');
const User = require('../models/User');
const Role = require('../models/Role');

const isValidName = (v) => /^[A-Z][a-zA-Z\s]{2,10}$/.test(v);
const isValidPassword = (v) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);

const createSchema = yup.object({
    firstName: yup
        .string()
        .required('First Name is required')
        .test('is-valid-first-name', 'First Name must start with a capital letter and be 2-10 characters long', isValidName),
    lastName: yup
        .string()
        .required('Last Name is required')
        .test('is-valid-last-name', 'Last Name must start with a capital letter and be 2-10 characters long', isValidName),
    email: yup
        .string()
        .required('Email is required')
        .email('Must be a valid email address')
        .test('email-exists', 'Email already exists', async function (value) {
            if (!value) return false;
            const existingEmail = await User.findOne({ email: value });
            return !existingEmail;
        }),
    password: yup
        .string()
        .required('Password is required')
        .test('is-valid-password', 'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)', isValidPassword),
    role: yup
        .string()
        .optional()
        .test('role-exists', 'Role does not exist', async function (value) {
            if (!value) return true;
            const validRole = value ? await Role.findById(value) : await Role.findOne({ name: 'user' });
            if (!validRole) {
                throw this.createError({
                    message: 'Role does not exist',
                });
            }
        }),
});

const getByIdSchema = yup.object({
    id: yup
        .string()
        .required('ID is required')
        .test('id-validation', 'User not found', async function (value) {
            if (!value) return false;
            const user = await User.findById(value);
            return !!user;
        }),
});

const updateSchema = yup.object({
    id: yup
        .string()
        .test('id-validation', 'User not found', async function (value) {
            if (!value) return false;
            const user = await User.findById(value);
            return !!user;
        }),
    firstName: yup
        .string()
        .test('is-valid-first-name', 'First Name must start with a capital letter and be 2-10 characters long', value => {
            if (!value) return true;
            return isValidName(value);
        }),
    lastName: yup
        .string()
        .test('is-valid-last-name', 'Last Name must start with a capital letter and be 2-10 characters long', value => {
            if (!value) return true;
            return isValidName(value);
        }),
    password: yup
        .string()
        .notRequired()
        .test('is-valid-password', 'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)', value => {
            if (!value) return true;
            return isValidPassword(value);
        }),
    email: yup
        .string()
        .notRequired()
        .email('Must be a valid email address')
        .test('email-exists', 'Email already exists', async function (value) {
            if (!value) return true;
            const existingEmail = await User.findOne({ email: value });
            return !existingEmail;
        }),
    role: yup
        .string()
        .notRequired()
        .test('role-exists', 'Role does not exist', async function (value) {
            if (!value) return true;
            const role = await Role.findById(value);
            return !!role;
        }),
});

const deleteSchema = yup.object({
    id: yup
        .string()
        .required('User ID is required')
        .test('id-validation', 'User not found', async function (value) {
            if (!value) return false;
            const user = await User.findById(value);
            return !!user;
        }),
});

const deleteBulkSchema = yup.object({
    ids: yup
        .array()
        .of(yup.string().required('ID is required'))
        .min(1, 'At least one ID is required')
        .required('IDs are required')
        .test('users-exist', 'One or more users not found', async function (ids) {
            const users = await User.find({ _id: { $in: ids } });
            return users.length === ids.length;
        }),
});

module.exports = { createSchema, getByIdSchema, updateSchema, deleteSchema, deleteBulkSchema };