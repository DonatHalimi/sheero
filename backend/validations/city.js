const yup = require('yup');
const Country = require('../models/Country');
const City = require('../models/City');

const isValidName = (v) => /^[A-Z][a-zA-Z\s]{2,15}$/.test(v);
const isValidZipCode = (v) => /^[0-9]{4,5}$/.test(v);

const createSchema = yup.object({
    name: yup
        .string()
        .required('Name is required')
        .test('is-valid-name', 'Name must start with a capital letter and be 3-15 characters long', isValidName),
    country: yup
        .string()
        .required('Country is required')
        .test('country-exists', 'Country does not exist', async function (value) {
            if (!value) return false;
            const country = await Country.findById(value);
            return !!country;
        }),
    zipCode: yup
        .string()
        .required('Zip code is required')
        .test('is-valid-zipcode', 'Zipcode must be a number between 4 and 5 digits long', isValidZipCode),
});

const getByIdSchema = yup.object({
    id: yup
        .string()
        .required('ID is required')
        .test('id-validation', 'City not found', async function (value) {
            if (!value) return false;
            const city = await City.findById(value);
            return !!city;
        }),
});

const updateSchema = yup.object({
    id: yup
        .string()
        .test('id-validation', 'City not found', async function (value) {
            if (!value) return false;
            const city = await City.findById(value);
            return !!city;
        }),
    name: yup
        .string()
        .test('is-valid-name', 'Name must start with a capital letter and be 3-15 characters long', value => {
            if (!value) return true;
            return isValidName(value);
        }),
    country: yup
        .string()
        .notRequired()
        .test('country-exists', 'Country does not exist', async function (value) {
            if (!value) return true;
            const country = await Country.findById(value);
            return !!country;
        }),
    zipCode: yup
        .string()
        .test('is-valid-zipcode', 'Zipcode must be a number between 4 and 5 digits long', value => {
            if (!value) return true;
            return isValidZipCode(value);
        }),
});

const deleteSchema = yup.object({
    id: yup
        .string()
        .required('City ID is required')
        .test('id-validation', 'City not found', async function (value) {
            if (!value) return false;
            const city = await City.findById(value);
            return !!city;
        }),
});

const deleteBulkSchema = yup.object({
    ids: yup
        .array()
        .of(yup.string().required('ID is required'))
        .min(1, 'At least one ID is required')
        .required('IDs are required')
        .test('cities-exist', 'One or more cities not found', async function (ids) {
            const cities = await City.find({ _id: { $in: ids } });
            return cities.length === ids.length;
        }),
});

module.exports = { createSchema, getByIdSchema, updateSchema, deleteSchema, deleteBulkSchema };