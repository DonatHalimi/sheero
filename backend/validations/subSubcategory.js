const yup = require('yup');
const Subcategory = require('../models/Subcategory');
const Product = require('../models/Product');
const SubSubcategory = require('../models/SubSubcategory');

const isValidName = (v) => /^[A-Z][\sa-zA-Z\W]{3,27}$/.test(v);

const createSchema = yup.object({
    name: yup
        .string()
        .required('Name is required')
        .test('is-valid-name', 'Name must start with a capital letter and be 3-27 characters long', isValidName),
    subcategory: yup
        .string()
        .required('Subcategory ID is required')
        .test('subcategory-exists', 'Subcategory not found', async function (value) {
            const subcategory = await Subcategory.findById(value);
            return !!subcategory;
        })
});

const getByIdSchema = yup.object({
    id: yup
        .string()
        .required('ID is required')
        .test('id-validation', 'Subsubategory not found', async function (value) {
            if (!value) return false;
            const subSubcategory = await SubSubcategory.findById(value);
            return !!subSubcategory;
        }),
});

const updateSchema = yup.object({
    id: yup
        .string()
        .required('SubSubcategory ID is required')
        .test('id-validation', 'SubSubcategory not found', async function (value) {
            if (!value) return false;
            const subSubcategory = await SubSubcategory.findById(value);
            return !!subSubcategory;
        }),
    name: yup
        .string()
        .test('is-valid-name', 'Name must start with a capital letter and be 3-27 characters long', value => {
            if (!value) return true;
            return isValidName(value);
        }),
    subcategory: yup
        .string()
        .test('subcategory-exists', 'Subcategory not found', async function (value) {
            if (value === undefined || value === null) return true;
            const subcategory = await Subcategory.findById(value);
            return !!subcategory;
        })
});

const deleteSchema = yup.object({
    id: yup
        .string()
        .required('SubSubcategory ID is required')
        .test('subSubcategory-exists', 'SubSubcategory not found', async function (value) {
            const subSubcategory = await SubSubcategory.findById(value);
            return !!subSubcategory;
        })
        .test('no-products', 'Cannot delete subSubcategory with existing products', async function (value) {
            const products = await Product.find({ subSubcategory: value });
            return products.length === 0;
        })
});

const deleteBulkSchema = yup.object({
    ids: yup
        .array()
        .of(yup.string().required('ID is required'))
        .min(1, 'At least one ID is required')
        .required('IDs are required')
        .test('subSubcategories-valid', 'One or more subSubcategories not found', async function (ids) {
            const subSubcategories = await SubSubcategory.find({ _id: { $in: ids } });
            if (subSubcategories.length !== ids.length) {
                throw this.createError({
                    message: 'One or more subSubcategories not found',
                });
            }

            for (const subSubcategory of subSubcategories) {
                const products = await Product.find({ subSubcategory: subSubcategory._id });
                if (products.length > 0) {
                    throw this.createError({
                        message: `Cannot delete subSubcategory ${subSubcategory.name} with existing products`,
                    });
                }
            }
            return true;
        }),
});

module.exports = { createSchema, getByIdSchema, updateSchema, deleteSchema, deleteBulkSchema };