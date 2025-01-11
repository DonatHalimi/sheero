const yup = require('yup');
const User = require('../models/User');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');

const isValidName = (v) => /^[A-Z][a-zA-Z\s]{1,9}$/.test(v);
const isValidPassword = (v) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\(\)_\+\-.])[A-Za-z\d@$!%*?&\(\)_\+\-.]{8,}$/.test(v);

const registerSchema = yup.object({
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
        .test('is-valid-password', 'Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*()?&)', isValidPassword),
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

const loginSchema = yup.object({
    email: yup
        .string()
        .email('Invalid email format')
        .required('Email is required')
        .test('user-exists', "Email doesn't exist", async function (value) {
            const user = await User.findOne({ email: value });
            return !!user;
        }),
    password: yup
        .string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters')
        .test('password-correct', 'Invalid credentials', async function (value) {
            const { email } = this.parent;
            const user = await User.findOne({ email });
            if (!user) return false;
            const isMatch = await bcrypt.compare(value, user.password);
            return isMatch;
        }),
});

module.exports = { registerSchema, loginSchema };