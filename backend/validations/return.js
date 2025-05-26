const yup = require('yup');
const Order = require('../models/Order');
const ReturnRequest = require('../models/ReturnRequest');

const reasons = [
    'Damaged Item',
    'Wrong Item Delivered',
    'Item Not as Described',
    'Changed My Mind',
    'Other',
];

// Check if the order ID is a valid 7-digit number representing the custom order ID using regex
const isValidId = (id) => /^\d{7}$/.test(id);
const validCustomReason = (v) => /^[A-Z][a-zA-Z\s]{5,20}$/.test(v);

const createSchema = yup.object({
    orderId: yup
        .string()
        .required('Order ID is required')
        .test('order-valid', 'Order does not exist or is not eligible for return', async function (value) {
            if (!value || !isValidId(value)) return false;

            const order = await Order.findById(value);
            if (!order) {
                throw this.createError({
                    message: 'Order not found',
                });
            }

            if (order.status !== 'delivered') {
                throw this.createError({
                    message: 'Cannot create a return request for an order that is not delivered',
                });
            }

            const user = this.options?.context?.user;
            if (!user?.userId) {
                throw this.createError({
                    message: 'Authentication required',
                });
            }

            if (order.user.toString() !== user.userId) {
                throw this.createError({
                    message: 'You do not have permission to create a return request for this order',
                });
            }

            return true;
        }),
    productIds: yup
        .array()
        .of(yup.string().length(24, 'Product ID must be a valid 24-character string'))
        .min(1, 'At least one product ID is required')
        .required('Product IDs are required')
        .test('products-validation', 'Invalid products or return requests', async function (productIds) {
            const { orderId } = this.parent;
            const user = this.options?.context?.user;

            if (!orderId || !productIds?.length || !user?.userId) return false;

            const order = await Order.findById(orderId);
            if (!order || order.status !== 'delivered') return false;

            const productIdsInOrder = order.products.map(p => p.product.toString());
            const allProductsInOrder = productIds.every(id => productIdsInOrder.includes(id));

            if (!allProductsInOrder) {
                throw this.createError({
                    message: 'Some products are not in the given order',
                });
            }

            const existingReturnRequests = await ReturnRequest.find({
                order: orderId,
                user: user.userId,
                products: { $in: productIds }
            });

            if (existingReturnRequests.length > 0) {
                const productsWithReturns = existingReturnRequests.reduce((acc, request) => {
                    return [...acc, ...request.products];
                }, []);

                throw this.createError({
                    message: 'Return request already exists for one or more products in this order',
                    params: { productsWithReturns }
                });
            }

            return true;
        }),
    reason: yup
        .string()
        .required('Reason is required')
        .oneOf(reasons, 'Invalid reason'),
    customReason: yup
        .string()
        .nullable()
        .when(['reason'], {
            is: (reason) => reason === 'Other',
            then: (schema) => schema
                .required('Custom reason is required when the reason is "Other"')
                .test('custom-reason-length', 'Custom reason must be between 5 and 20 characters long', validCustomReason),
            otherwise: (schema) => schema.nullable()
        })
});

const manageSchema = yup.object({
    requestId: yup.
        string().
        required('Request ID is required')
        .test('is-numeric-id', 'Request ID must be numeric', isValidId)
        .test('request-exists', 'Return request not found', async function (value) {
            if (!value) return false;
            const returnRequest = await ReturnRequest.findById(value);
            return !!returnRequest;
        }),
    status: yup
        .string()
        .required('Status is required')
        .oneOf(['pending', 'approved', 'processed', 'rejected'], 'Invalid status'),
});

const getByIdSchema = yup.object({
    returnId: yup.string().required('Return ID is required').test('is-numeric-id', 'Return ID must be numeric', isValidId),
});

const deleteSchema = yup.object({
    id: yup
        .string()
        .required('ID is required')
        .test('id-validation', 'Return request not found', async function (value) {
            if (!value) return false;
            const returnRequest = await ReturnRequest.findById(value);
            return !!returnRequest;
        }),
});

const deleteBulkSchema = yup.object({
    ids: yup
        .array()
        .of(yup.string().test('is-numeric-id', 'Each ID must be numeric', isValidId))
        .min(1, 'At least one ID is required')
        .required('IDs are required')
        .test('id-validation', 'One or more return requests not found', async function (ids) {
            if (!ids || ids.length === 0) return false;

            const returnRequests = await ReturnRequest.find({ _id: { $in: ids } });
            return returnRequests.length === ids.length;
        }),
});

module.exports = { createSchema, manageSchema, getByIdSchema, deleteSchema, deleteBulkSchema };