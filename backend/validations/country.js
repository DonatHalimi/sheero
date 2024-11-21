const yup = require('yup');
const Country = require('../models/Country');

const isValidName = (v) => /^[A-Z][a-zA-Z\s]{3,15}$/.test(v);

const createSchema = yup.object({
    name: yup
        .string()
        .required('Name is required')
        .test('is-valid-name', 'Name must start with a capital letter and be 3-15 characters long', isValidName),
});

const getByIdSchema = yup.object({
    id: yup
        .string()
        .required('ID is required')
        .test('id-validation', 'Country not found', async function (value) {
            if (!value) return false;
            const country = await Country.findById(value);
            return !!country;
        }),
});

const updateSchema = yup.object({
    id: yup
        .string()
        .test('id-validation', 'Country not found', async function (value) {
            if (!value) return false;
            const country = await Country.findById(value);
            return !!country;
        }),
    name: yup
        .string()
        .test('is-valid-name', 'Name must start with a capital letter and be 3-15 characters long', value => {
            if (!value) return true;
            return isValidName(value);
        })
});

const deleteSchema = yup.object({
    id: yup
        .string()
        .required('Country ID is required')
        .test('id-validation', 'Country not found', async function (value) {
            if (!value) return false;
            const country = await Country.findById(value);
            return !!country;
        }),
});

const deleteBulkSchema = yup.object({
    ids: yup
        .array()
        .of(yup.string().required('ID is required'))
        .min(1, 'At least one ID is required')
        .required('IDs are required')
        .test('addresses-exist', 'One or more countries not found', async function (ids) {
            const countries = await Country.find({ _id: { $in: ids } });
            return countries.length === ids.length;
        }),
});

module.exports = { createSchema, getByIdSchema, updateSchema, deleteSchema, deleteBulkSchema };