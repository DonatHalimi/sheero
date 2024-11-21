const yup = require('yup');
const Contact = require('../models/Contact');

const isNameValid = (v) => /^[A-Z][\sa-zA-Z\W]{3,15}$/.test(v);
const isSubjectValid = (v) => /^[A-Z][\sa-zA-Z\W]{5,50}$/.test(v);
const isMessageValid = (v) => /^[A-Z][\sa-zA-Z\W]{10,200}$/.test(v);

const createSchema = yup.object({
    name: yup
        .string()
        .required('Name is required')
        .test('is-valid-name', 'Name must start with a capital letter and be 3-15 characters long', isNameValid),
    email: yup
        .string()
        .required('Email is required')
        .email('Must be a valid email address'),
    subject: yup
        .string()
        .required('Subject is required')
        .test('is-valid-subject', 'Subject must start with a capital letter and be 5-50 characters long', isSubjectValid),
    message: yup
        .string()
        .required('Message is required')
        .test('is-valid-message', 'Message must start with a capital letter and be 10-200 characters long', isMessageValid)
});

const deleteSchema = yup.object({
    id: yup
        .string()
        .required('ID is required')
        .test('id-validation', 'Contact message not found', async function (value) {
            if (!value) return false;
            const contact = await Contact.findById(value);
            return !!contact;
        }),
});

const deleteBulkSchema = yup.object({
    ids: yup
        .array()
        .of(yup.string().required('ID is required'))
        .min(1, 'At least one ID is required')
        .required('IDs are required')
        .test('addresses-exist', 'One or more contact messages not found', async function (ids) {
            const contacts = await Contact.find({ _id: { $in: ids } });
            return contacts.length === ids.length;
        }),
});

module.exports = { createSchema, deleteSchema, deleteBulkSchema };
