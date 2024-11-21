const yup = require('yup');
const Subcategory = require('../models/Subcategory');
const Category = require('../models/Category');
const Product = require('../models/Product');
const SubSubcategory = require('../models/SubSubcategory');

const isValidName = (v) => /^[A-Z][\sa-zA-Z\W]{3,27}$/.test(v);

const createSchema = yup.object({
    name: yup
        .string()
        .required('Name is required')
        .test('is-valid-name', 'Name must start with a capital letter and be 3-27 characters long', isValidName),
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
    category: yup
        .string()
        .required('Category ID is required')
        .test('category-exists', 'Category not found', async function (value) {
            const category = await Category.findById(value);
            return !!category;
        })
});

const getByIdSchema = yup.object({
    id: yup
        .string()
        .required('ID is required')
        .test('id-validation', 'Subategory not found', async function (value) {
            if (!value) return false;
            const subcategory = await Subcategory.findById(value);
            return !!subcategory;
        }),
});

const updateSchema = yup.object({
    id: yup
        .string()
        .required('Subcategory ID is required')
        .test('id-validation', 'Subcategory not found', async function (value) {
            if (!value) return false;
            const subcategory = await Subcategory.findById(value);
            return !!subcategory;
        }),
    name: yup
        .string()
        .test('is-valid-name', 'Name must start with a capital letter and be 3-27 characters long', value => {
            if (!value) return true;
            return isValidName(value);
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
    category: yup
        .string()
        .test('category-exists', 'Category not found', async function (value) {
            if (value === undefined || value === null) return true;
            const category = await Category.findById(value);
            return !!category;
        })
});

const deleteSchema = yup.object({
    id: yup
        .string()
        .required('Subcategory ID is required')
        .test('subcategory-exists', 'Subcategory not found', async function (value) {
            const subcategory = await Subcategory.findById(value);
            return !!subcategory;
        })
        .test('no-products', 'Cannot delete subcategory with existing products', async function (value) {
            const products = await Product.find({ subcategory: value });
            return products.length === 0;
        })
        .test('no-subsubcategories', 'Cannot delete subcategory with existing subsubcategories', async function (value) {
            const subsubcategories = await SubSubcategory.find({ category: value });
            return subsubcategories.length === 0;
        }),
});

const deleteBulkSchema = yup.object({
    ids: yup
        .array()
        .of(yup.string().required('ID is required'))
        .min(1, 'At least one ID is required')
        .required('IDs are required')
        .test('subcategories-valid', 'One or more subcategories not found', async function (ids) {
            const subcategories = await Subcategory.find({ _id: { $in: ids } });
            if (subcategories.length !== ids.length) {
                throw this.createError({
                    message: 'One or more subcategories not found',
                });
            }

            for (const subcategory of subcategories) {
                const products = await Product.find({ subcategory: subcategory._id });
                if (products.length > 0) {
                    throw this.createError({
                        message: `Cannot delete subcategory ${subcategory.name} with existing products`,
                    });
                }

                const subSubcategories = await SubSubcategory.find({ subcategory: subcategory._id });
                if (subSubcategories.length > 0) {
                    throw this.createError({
                        message: `Cannot delete subcategory ${subcategory.name} with existing subSubcategories`,
                    });
                }
            }
            return true;
        }),
});

module.exports = { createSchema, getByIdSchema, updateSchema, deleteSchema, deleteBulkSchema };