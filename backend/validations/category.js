const yup = require('yup');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Subcategory = require('../models/Subcategory');

const isValidName = (v) => /^[A-Z][\sa-zA-Z\W]{3,28}$/.test(v);

const createSchema = yup.object({
    name: yup
        .string()
        .required('Name is required')
        .test('is-valid-name', 'Name must start with a capital letter and be 3-28 characters long', isValidName),
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
        })
});

const getByIdSchema = yup.object({
    id: yup
        .string()
        .required('ID is required')
        .test('id-validation', 'Category not found', async function (value) {
            if (!value) return false;
            const category = await Category.findById(value);
            return !!category;
        }),
});

const updateSchema = yup.object({
    id: yup
        .string()
        .required('Category ID is required')
        .test('id-validation', 'Category not found', async function (value) {
            if (!value) return false;
            const category = await Category.findById(value);
            return !!category;
        }),
    name: yup
        .string()
        .test('is-valid-name', 'Name must start with a capital letter and be 3-28 characters long', value => {
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
        })
});

const deleteSchema = yup.object({
    id: yup
        .string()
        .required('Category ID is required')
        .test('category-exists', 'Category not found', async function (value) {
            const category = await Category.findById(value);
            return !!category;
        })
        .test('no-products', 'Cannot delete category with existing products', async function (value) {
            const products = await Product.find({ category: value });
            return products.length === 0;
        })
        .test('no-subcategories', 'Cannot delete category with existing subcategories', async function (value) {
            const subcategories = await Subcategory.find({ category: value });
            return subcategories.length === 0;
        }),
});

const deleteBulkSchema = yup.object({
    ids: yup
        .array()
        .of(yup.string().required('ID is required'))
        .min(1, 'At least one ID is required')
        .required('IDs are required')
        .test('categories-valid', 'One or more categories not found', async function (ids) {
            const categories = await Category.find({ _id: { $in: ids } });
            if (categories.length !== ids.length) {
                throw this.createError({
                    message: 'One or more categories not found',
                });
            }

            for (const category of categories) {
                const products = await Product.find({ category: category._id });
                if (products.length > 0) {
                    throw this.createError({
                        message: `Cannot delete category ${category.name} with existing products`,
                    });
                }

                const subcategories = await Subcategory.find({ category: category._id });
                if (subcategories.length > 0) {
                    throw this.createError({
                        message: `Cannot delete category ${category.name} with existing subcategories`,
                    });
                }
            }
            return true;
        }),
});

module.exports = { createSchema, getByIdSchema, updateSchema, deleteSchema, deleteBulkSchema };