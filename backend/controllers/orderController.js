const Address = require('../models/Address');
const Order = require('../models/Order');
const Stripe = require('stripe');
const Cart = require('../models/Cart');
const { STRIPE_SECRET_KEY, NODE_ENV } = require('../config/dotenv');
const { sendOrderUpdateEmail } = require('../config/emailService');

const stripe = Stripe(STRIPE_SECRET_KEY);

const frontendUrl = NODE_ENV === 'production' ? 'https://sheero.onrender.com' : 'http://localhost:3000';

const payWithStripe = async (req, res) => {
    try {
        const { cartId, addressId, userId, email } = req.body;

        const cart = await Cart.findById(cartId).populate('items.product');
        const address = await Address.findById(addressId)
            .populate('city', 'name')
            .populate('country', 'name')
            .exec();

        if (!cart || !address) {
            return res.status(404).send('Cart or address not found');
        }

        const totalAmount = await cart.calculateTotalPrice();
        const shippingCost = 2;
        const totalWithShipping = totalAmount + shippingCost;

        const lineItems = cart.items.map(item => ({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: item.product.name,
                },
                unit_amount: Math.round((item.product.salePrice || item.product.price) * 100),
            },
            quantity: item.quantity,
        }));

        lineItems.push({
            price_data: {
                currency: 'eur',
                product_data: { name: 'Shipping', description: `Shipping cost` },
                unit_amount: Math.round(shippingCost * 100),
            },
            quantity: 1,
        });

        const order = new Order({
            user: userId,
            products: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.salePrice || item.product.price,
            })),
            address: addressId,
            totalAmount: totalWithShipping,
            paymentStatus: 'pending',
            paymentMethod: 'stripe',
            paymentIntentId: 'pending',
        });

        await order.save();

        await Promise.all(
            cart.items.map(async (item) => {
                if (item.product.inventoryCount >= item.quantity) {
                    item.product.inventoryCount -= item.quantity;
                    await item.product.save();
                } else {
                    throw new Error(`Product ${item.product.name} is out of stock.`);
                }
            })
        );

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${frontendUrl}/verify?success=true&session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
            cancel_url: `${frontendUrl}/verify?success=false&session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
            customer_email: email,
            metadata: {
                userId: userId,
                addressId: addressId,
                totalAmount: totalWithShipping.toFixed(2),
                addressDetails: JSON.stringify({
                    name: address.name,
                    street: address.street,
                    phoneNumber: address.phoneNumber,
                    city: address.city.name,
                    country: address.country.name
                }),
                fullAddress: `${address.street}, ${address.city.name}, ${address.country.name}`,
                orderId: order._id.toString()
            }
        });

        await Order.findByIdAndUpdate(order._id, { paymentIntentId: session.id });

        const populatedOrder = await Order.findById(order._id)
            .populate('user')
            .populate('products.product')
            .populate('address')
            .populate({
                path: 'address',
                populate: [
                    { path: 'city', select: 'name zipCode' },
                    { path: 'country', select: 'name' }
                ]
            });

        if (populatedOrder.user && populatedOrder.user.email) {
            await sendOrderUpdateEmail(populatedOrder);
        } else {
            console.warn(`Order ${order._id} has no user email associated.`);
        }

        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating Stripe session or saving order', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

const verifyOrder = async (req, res) => {
    const { order_id, success } = req.body;

    try {
        const isSuccess = String(success) === 'true';

        if (isSuccess) {
            const updatedOrder = await Order.findByIdAndUpdate(order_id, { paymentStatus: 'completed' }, { new: true });

            if (!updatedOrder) {
                return res.status(404).json({ success: false, message: 'Order not found.' });
            }

            return res.json({ success: true, message: 'Payment completed successfully.', order: updatedOrder });
        } else {
            await Order.findByIdAndDelete(order_id);

            return res.json({ success: false, message: 'Payment failed. Order has been deleted.' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'An error occurred during verification.', error: error.message });
    }
};

const payWithCash = async (req, res) => {
    const { cartId, addressId, userId } = req.body;

    try {
        const cart = await Cart.findById(cartId).populate('items.product');
        const address = await Address.findById(addressId)
            .populate('city', 'name zipCode')
            .populate('country', 'name');

        if (!cart || !address) {
            return res.status(404).send('Cart or address not found');
        }

        const subtotal = await cart.calculateTotalPrice();
        const shippingCost = 2;
        const totalAmount = subtotal + shippingCost;

        const order = new Order({
            user: userId,
            products: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.product.salePrice || item.product.price,
            })),
            address: addressId,
            totalAmount: totalAmount,
            paymentStatus: 'pending',
            paymentMethod: 'cash',
        });

        await order.save();

        await Promise.all(
            cart.items.map(async (item) => {
                if (item.product.inventoryCount >= item.quantity) {
                    item.product.inventoryCount -= item.quantity;
                    await item.product.save();
                } else {
                    throw new Error(`Product ${item.product.name} is out of stock.`);
                }
            })
        );

        const populatedOrder = await Order.findById(order._id)
            .populate('user')
            .populate('products.product')
            .populate('address')
            .populate({
                path: 'address',
                populate: [
                    { path: 'city', select: 'name zipCode' },
                    { path: 'country', select: 'name' }
                ]
            });

        if (populatedOrder.user && populatedOrder.user.email) {
            await sendOrderUpdateEmail(populatedOrder);
        } else {
            console.warn(`Order ${order._id} has no user email associated.`);
        }

        res.json({
            success: true,
            message: 'Order created successfully. Please pay with cash on delivery.',
            order: populatedOrder,
        });
    } catch (error) {
        console.error('Error processing cash order', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'firstName lastName email')
            .populate('products.product', 'name price')
            .populate({
                path: 'address',
                select: 'name street phoneNumber city country',
                populate: [
                    {
                        path: 'country',
                        select: 'countryCode name'
                    },
                    {
                        path: 'city',
                        select: 'name zipCode'
                    }
                ]
            })
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders', error);
        res.status(500).send('Server error');
    }
};

const getUserOrders = async (req, res) => {
    const userId = req.params.userId;

    try {
        const orders = await Order.find({ user: userId })
            .populate('products.product', 'name price image')
            .populate('address', 'name street phoneNumber city country')
            .sort({ createdAt: -1 })
            .exec();

        if (!orders.length) {
            return res.json({ success: false, message: 'No orders found for this user.' });
        }

        res.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ success: false, message: 'Error fetching orders.' });
    }
};

const getOrderById = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findById(orderId)
            .populate('products.product', 'name price image')
            .populate({
                path: 'address',
                select: 'name phoneNumber street comment',
                populate: [
                    { path: 'city', select: 'name zipCode' },
                    { path: 'country', select: 'name' }
                ]
            })
            .exec();

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        res.json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching order.' });
    }
};

const updateDeliveryStatus = async (req, res) => {
    const { orderId, status, paymentStatus } = req.body;

    try {
        if (!orderId || !status) {
            return res.status(400).json({ success: false, message: 'orderId and status are required.' });
        }

        const order = await Order.findById(orderId)
            .populate('products.product')
            .populate('user')
            .populate({
                path: 'address',
                populate: [
                    { path: 'city', select: 'name zipCode' },
                    { path: 'country', select: 'name' }
                ]
            });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        const previousStatus = order.status;

        order.status = status;

        if (paymentStatus) {
            order.paymentStatus = paymentStatus;
        }

        if (status === 'delivered') {
            const currentDate = new Date();
            order.arrivalDateRange.start = currentDate;
            order.arrivalDateRange.end = currentDate;
        }

        await order.save();

        if (order.user && order.user.email) {
            await sendOrderUpdateEmail(order);
        } else {
            console.warn(`Order ${orderId} has no user email associated.`);
        }

        res.json({
            success: true,
            message: `The status of order #${orderId} has been successfully updated from '${previousStatus}' to '${status}'. Click to copy the order ID.`,
            order,
        });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ success: false, message: 'Error updating order.' });
    }
};

const deleteOrders = async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Invalid or empty ids array' });
    }

    try {
        const orders = await Order.find({ _id: { $in: ids } });

        if (orders.length !== ids.length) {
            return res.status(404).json({ message: 'One or more orders not found' });
        }

        await Order.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ message: 'Orders deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { payWithStripe, verifyOrder, payWithCash, getAllOrders, getUserOrders, getOrderById, updateDeliveryStatus, deleteOrders };