const yup = require('yup');
const City = require('../models/City');
const Country = require('../models/Country');
const Address = require('../models/Address');

const isValidName = (v) => /^[A-ZÇ][a-zA-ZëËçÇ\s]{2,10}$/.test(v);
const isValidStreet = (v) => /^[A-Z][a-zA-Z0-9\s]{2,27}$/.test(v);
const isValidPhone = (v) => /^0(43|44|45|46|47|48|49)\d{6}$/.test(v);
const isValidComment = (v) => /^[a-zA-Z0-9\s]{2,25}$/.test(v);

const createSchema = yup.object({
    name: yup
        .string()
        .required('Name is required')
        .test('is-valid-name', 'Name must start with a capital letter and be 2-10 characters long', isValidName),
    street: yup
        .string()
        .required('Street is required')
        .test('is-valid-street', 'Street must start with a capital letter and be 2-27 characters long', isValidStreet),
    phoneNumber: yup
        .string()
        .required('Phone number is required')
        .test('is-valid-phone', 'Phone number must start with 043, 044, 045, 046, 047, 048 or 049 followed by 6 digits', isValidPhone),
    city: yup
        .string()
        .required('City is required')
        .test('city-exists', 'City does not exist', async function (value) {
            const city = await City.findOne({ _id: value });

            if (!city) {
                throw this.createError({
                    message: 'City does not exist',
                });
            }

            return true;
        }),
    country: yup
        .string()
        .required('Country is required')
        .test('country-exists', 'Country does not exist', async function (value) {
            const country = await Country.findOne({ _id: value });

            if (!country) {
                throw this.createError({
                    message: 'Country does not exist',
                });
            }

            return true;
        }),
    comment: yup
        .string()
        .nullable()
        .test('is-valid-comment', 'Comment must be 2-25 characters long and contain only alphanumeric characters and spaces', function (value) {
            if (value && !isValidComment(value)) {
                return this.createError({
                    message: 'Comment must be 2-25 characters long and contain only alphanumeric characters and spaces',
                });
            }
            return true;
        }),
    checkAddress: yup
        .string()
        .test('address-exists', 'You already have an address. Please update it instead', async function (value) {
            const user = this.options?.context?.user;

            if (!user?.userId) {
                throw this.createError({
                    message: 'Authentication required',
                });
            }

            const existingAddress = await Address.findOne({ user: user.userId });

            if (existingAddress) {
                throw this.createError({
                    message: 'You already have an address. Please update it instead',
                });
            }

            return true;
        })
});

const getByIdSchema = yup.object({
    id: yup
        .string()
        .required('ID is required')
        .test('id-validation', 'Address not found', async function (value) {
            if (!value) return false;
            const address = await Address.findById(value);
            return !!address;
        }),
});

const getUserAddressSchema = yup.object({
    getUserAddress: yup
        .string()
        .test('address-exists', 'No address found for the current user', async function (value) {
            const user = this.options?.context?.user;

            if (!user?.userId) {
                throw this.createError({
                    message: 'Authentication required',
                });
            }

            const address = await Address.findOne({ user: user.userId });

            if (!address) {
                throw this.createError({
                    message: 'No address found for the current user',
                });
            }

            return true;
        }),
});

const updateSchema = yup.object({
    id: yup
        .string()
        .required('Address ID is required')
        .test('id-validation', 'Address not found', async function (value) {
            if (!value) return false;
            const address = await Address.findById(value);
            return !!address;
        }),
    name: yup
        .string()
        .test('is-valid-name', 'Name must start with a capital letter and be 2-10 characters long', function (value) {
            if (value) {
                return isValidName(value);
            }
            return true;
        }),
    street: yup
        .string()
        .test('is-valid-street', 'Street must start with a capital letter and be 2-27 characters long', function (value) {
            if (value) {
                return isValidStreet(value);
            }
            return true;
        }),
    phoneNumber: yup
        .string()
        .test('is-valid-phone', 'Phone number must start with 043, 044, 045, 046, 047, 048 or 049 followed by 6 digits', function (value) {
            if (value) {
                return isValidPhone(value);
            }
            return true;
        }),
    city: yup
        .string()
        .test('city-exists', 'City does not exist', async function (value) {
            if (value) {
                const city = await City.findOne({ _id: value });
                if (!city) {
                    throw this.createError({
                        message: 'City does not exist',
                    });
                }
            }
            return true;
        }),
    country: yup
        .string()
        .test('country-exists', 'Country does not exist', async function (value) {
            if (value) {
                const country = await Country.findOne({ _id: value });
                if (!country) {
                    throw this.createError({
                        message: 'Country does not exist',
                    });
                }
            }
            return true;
        }),
    comment: yup
        .string()
        .nullable()
        .test('is-valid-comment', 'Comment must be 2-25 characters long', function (value) {
            if (value) {
                return isValidComment(value);
            }
            return true;
        }),
});

const deleteSchema = yup.object({
    id: yup
        .string()
        .required('ID is required')
        .test('id-validation', 'Invalid ID', async function (id) {
            const address = await Address.findOne({ _id: id });
            if (!address) {
                throw this.createError({
                    message: 'Address not found',
                });
            }
            return true;
        }),
});

const deleteBulkSchema = yup.object({
    ids: yup
        .array()
        .of(yup.string().required('ID is required'))
        .min(1, 'At least one ID is required')
        .required('IDs are required')
        .test('addresses-exist', 'One or more addresses not found', async function (ids) {
            const addresses = await Address.find({ _id: { $in: ids } });
            return addresses.length === ids.length;
        }),
});

module.exports = { createSchema, getByIdSchema, getUserAddressSchema, updateSchema, deleteSchema, deleteBulkSchema };