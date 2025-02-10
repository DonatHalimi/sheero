const yup = require('yup');
const Supplier = require('../models/Supplier');

const isValidName = (v) => /^[A-Z][a-zA-Z]{2,15}$/.test(v);
const isValidPhone = (v) => /^0(43|44|45|46|47|48|49)\d{6}$/.test(v);

const createSchema = yup.object({
    name: yup
        .string()
        .required('Name is required')
        .test('is-valid-name', 'Name must start with a capital letter and be 2-15 characters long', isValidName),
    contactInfo: yup.object({
        email: yup
            .string()
            .required('Email is required')
            .email('Must be a valid email address'),
        phoneNumber: yup
            .string()
            .required('Phone number is required')
            .test('is-valid-phone', 'Phone number must start with 043, 044, 045, 046, 047, 048 or 049 followed by 6 digits', isValidPhone),
    }),
});

const getByIdSchema = yup.object({
    id: yup
        .string()
        .required('ID is required')
        .test('id-validation', 'Supplier not found', async function (value) {
            if (!value) return false;
            const supplier = await Supplier.findById(value);
            return !!supplier;
        }),
});

const updateSchema = yup.object({
    id: yup
        .string()
        .required('Supplier ID is required')
        .test('id-validation', 'Supplier not found', async function (value) {
            if (!value) return false;
            const supplier = await Supplier.findById(value);
            return !!supplier;
        }),
    name: yup
        .string()
        .test('is-valid-name', 'Name must start with a capital letter and be 2-15 characters long', function (value) {
            if (value) {
                return isValidName(value);
            }
            return true;
        }),
    contactInfo: yup.object({
        email: yup
            .string()
            .email('Must be a valid email address'),
        phoneNumber: yup
            .string()
            .test('is-valid-phone', 'Phone number must start with 043, 044, 045, 046, 047, 048 or 049 followed by 6 digits', function (value) {
                if (value) {
                    return isValidPhone(value);
                }
                return true;
            }),
    }),
});

const deleteSchema = yup.object({
    id: yup
        .string()
        .required('ID is required')
        .test('id-validation', 'Supplier not found', async function (value) {
            if (!value) return false;
            const supplier = await Supplier.findById(value);
            return !!supplier;
        }),
});

const deleteBulkSchema = yup.object({
    ids: yup
        .array()
        .of(yup.string().required('ID is required'))
        .min(1, 'At least one ID is required')
        .required('IDs are required')
        .test('suppliers-exist', 'One or more suppliers not found', async function (ids) {
            const suppliers = await Supplier.find({ _id: { $in: ids } });
            return suppliers.length === ids.length;
        }),
});

module.exports = { createSchema, getByIdSchema, updateSchema, deleteSchema, deleteBulkSchema };
