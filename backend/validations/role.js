const yup = require('yup');
const Role = require('../models/Role');

const isValid = (v) => /^[a-zA-Z\s]{2,15}$/.test(v);
const isValidDescription = (v) => /^.{5,500}$/.test(v);

const createSchema = yup.object({
    name: yup
        .string()
        .required('Name is required')
        .test('is-valid-name', 'Name must be 2-15 characters long', isValid),
    description: yup
        .string()
        .required('Description is required')
        .test('is-valid-description', 'Description must be 5-500 characters long', isValidDescription),
});

const getByIdSchema = yup.object({
    id: yup
        .string()
        .required('ID is required')
        .test('id-validation', 'Role not found', async function (value) {
            if (!value) return false;
            const role = await Role.findById(value);
            return !!role;
        }),
});

const updateSchema = yup.object({
    id: yup
        .string()
        .test('id-validation', 'Role not found', async function (value) {
            if (!value) return false;
            const role = await Role.findById(value);
            return !!role;
        }),
    name: yup
        .string()
        .test('is-valid-name', 'Name must start with a capital letter and be 2-15 characters long', value => {
            if (!value) return true;
            return isValid(value);
        }),
    description: yup
        .string()
        .test('is-valid-description', 'Description must be 5-500 characters long', value => {
            if (!value) return true;
            return isValidDescription(value);
        }),
});

const deleteSchema = yup.object({
    id: yup
        .string()
        .required('Role ID is required')
        .test('id-validation', 'Role not found', async function (value) {
            if (!value) return false;
            const role = await Role.findById(value);
            return !!role;
        }),
});

const deleteBulkSchema = yup.object({
    ids: yup
        .array()
        .of(yup.string().required('ID is required'))
        .min(1, 'At least one ID is required')
        .required('IDs are required')
        .test('roles-exist', 'One or more roles not found', async function (ids) {
            const roles = await Role.find({ _id: { $in: ids } });
            return roles.length === ids.length;
        }),
});

module.exports = { createSchema, getByIdSchema, updateSchema, deleteSchema, deleteBulkSchema };