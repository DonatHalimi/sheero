const yup = require('yup');
const SlideshowImage = require('../models/SlideshowImage');

const isValid = (v) => /^[A-Z][\sa-zA-Z\W]{3,15}$/.test(v);

const createSchema = yup.object({
    title: yup
        .string()
        .required('Title is required')
        .test('is-valid-title', 'Title must start with a capital letter and be 3-15 characters long', isValid),
    image: yup
        .mixed()
        .required('Image is required')
        .test('is-valid-image', 'Invalid image input', function (value) {
            if (value && value.path) {
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                return allowedTypes.includes(value.mimetype);
            }
            if (typeof value === 'string' || value === null) {
                return true;
            }
            return false;
        }),
    description: yup
        .string()
        .required('Description is required')
        .test('is-valid-description', 'Description must start with a capital letter and be 3-15 characters long', isValid)
});

const getByIdSchema = yup.object({
    id: yup
        .string()
        .required('ID is required')
        .test('id-validation', 'Slideshow image not found', async function (value) {
            if (!value) return false;
            const slideshow = await SlideshowImage.findById(value);
            return !!slideshow;
        }),
});

const updateSchema = yup.object({
    id: yup
        .string()
        .required('Slideshow ID is required')
        .test('id-validation', 'Slideshow image not found', async function (value) {
            if (!value) return true;
            const slideshow = await SlideshowImage.findById(value);
            return !!slideshow;
        }),
    title: yup
        .string()
        .test('is-valid-title', 'Title must start with a capital letter and be 3-15 characters long', value => {
            if (!value) return true;
            return isValid(value);
        }),
    image: yup
        .mixed()
        .optional()
        .test('is-valid-image', 'Invalid image input', function (value) {
            if (value === undefined) return true;

            if (value && value.path) {
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
                return allowedTypes.includes(value.mimetype);
            }

            if (typeof value === 'string' || value === null) {
                return true;
            }

            return false;
        }),
    description: yup
        .string()
        .test('is-valid-description', 'Description must start with a capital letter and be 3-15 characters long', value => {
            if (!value) return true;
            return isValid(value);
        }),
});

const deleteSchema = yup.object({
    id: yup
        .string()
        .required('Slideshow ID is required')
        .test('slideshow-exists', 'Slideshow not found', async function (value) {
            const slideshow = await SlideshowImage.findById(value);
            return !!slideshow;
        })
});

const deleteBulkSchema = yup.object({
    ids: yup
        .array()
        .of(yup.string().required('ID is required'))
        .min(1, 'At least one ID is required')
        .required('IDs are required')
        .test('slideshows-exist', 'One or more slideshows not found', async function (ids) {
            const slideshows = await SlideshowImage.find({ _id: { $in: ids } });
            return slideshows.length === ids.length;
        }),
});

module.exports = { createSchema, getByIdSchema, updateSchema, deleteSchema, deleteBulkSchema };