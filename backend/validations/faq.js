const yup = require('yup');
const FAQ = require('../models/FAQ');

const isValid = (v) => /^[A-Z][\s\S]{10,50}$/.test(v);

const createSchema = yup.object({
    question: yup
        .string()
        .required('Question is required')
        .test('is-valid-question', 'Question must start with a capital letter and be 10-50 characters long', isValid),
    answer: yup
        .string()
        .required('Answer is required')
        .test('is-valid-answer', 'Answer must start with a capital letter and be 10-50 characters long', isValid),
});

const getByIdSchema = yup.object({
    id: yup
        .string()
        .required('ID is required')
        .test('id-validation', 'FAQ not found', async function (value) {
            if (!value) return false;
            const faq = await FAQ.findById(value);
            return !!faq;
        }),
});

const updateSchema = yup.object({
    id: yup
        .string()
        .test('id-validation', 'FAQ not found', async function (value) {
            if (!value) return false;
            const faq = await FAQ.findById(value);
            return !!faq;
        }),
    question: yup
        .string()
        .test('is-valid-question', 'Question must start with a capital letter and be 10-50 characters long', value => {
            if (!value) return true;
            return isValid(value);
        }),
    answer: yup
        .string()
        .test('is-valid-answer', 'Answer must start with a capital letter and be 10-50 characters long', value => {
            if (!value) return true;
            return isValid(value);
        }),
});

const deleteSchema = yup.object({
    id: yup
        .string()
        .required('FAQ ID is required')
        .test('id-validation', 'FAQ not found', async function (value) {
            if (!value) return false;
            const faq = await FAQ.findById(value);
            return !!faq;
        }),
});

const deleteBulkSchema = yup.object({
    ids: yup
        .array()
        .of(yup.string().required('ID is required'))
        .min(1, 'At least one ID is required')
        .required('IDs are required')
        .test('faqs-exist', 'One or more faqs not found', async function (ids) {
            const faqs = await FAQ.find({ _id: { $in: ids } });
            return faqs.length === ids.length;
        }),
});

module.exports = { createSchema, getByIdSchema, updateSchema, deleteSchema, deleteBulkSchema };