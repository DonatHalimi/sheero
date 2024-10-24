const Product = require('../models/Product');
const Address = require('../models/Address');
const Order = require('../models/Order');
const dotenv = require('dotenv');
const Stripe = require('stripe');
const User = require('../models/User');

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const frontendUrl = process.env.NODE_ENV === 'production' ? 'https://sheero.onrender.com' : 'http://localhost:3000';

const payWithStripe = async (req, res) => {
    try {
        const { productIds, addressId, userId, email } = req.body;

        const products = await Product.find({ '_id': { $in: productIds } });

        const address = await Address.findById(addressId)
            .populate('city', 'name')
            .populate('country', 'name')
            .exec();

        if (!address) {
            return res.status(404).send('Address not found');
        }

        const lineItems = products.map(product => {
            const priceToUse = product.salePrice ? product.salePrice : product.price;

            return {
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: product.name,
                    },
                    unit_amount: Math.round(priceToUse * 100),
                },
                quantity: 1,
            };
        });

        const totalAmount = products.reduce((total, product) => {
            const priceToUse = product.salePrice ? product.salePrice : product.price;
            return total + priceToUse;
        }, 0);

        const shippingCost = 2;
        const totalWithShipping = totalAmount + shippingCost;

        lineItems.push({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: 'Shipping',
                    description: `Shipping cost`,
                },
                unit_amount: Math.round(shippingCost * 100),
            },
            quantity: 1,
        });

        const order = new Order({
            user: userId,
            products: productIds.map(productId => ({
                product: productId,
                quantity: 1,
                price: products.find(product => product._id.equals(productId)).salePrice || products.find(product => product._id.equals(productId)).price
            })),
            address: addressId,
            totalAmount: totalWithShipping,
            paymentStatus: 'pending',
            paymentMethod: 'stripe',
            paymentIntentId: 'pending',
        });

        await order.save();

        await Promise.all(
            products.map(async (product) => {
                if (product.inventoryCount > 0) {
                    product.inventoryCount -= 1;
                    await product.save();
                } else {
                    throw new Error(`Product ${product.name} is out of stock.`);
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
            const deletedOrder = await Order.findByIdAndDelete(order_id);

            if (!deletedOrder) {
                return res.status(404).json({ success: false, message: 'Order not found.' });
            }

            return res.json({ success: false, message: 'Payment failed. Order has been deleted.' });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: 'An error occurred during verification.', error: error.message });
    }
};

const payWithCash = async (req, res) => {
    try {
        const { productIds, addressId, userId } = req.body;

        const products = await Product.find({ '_id': { $in: productIds } });

        const address = await Address.findById(addressId)
            .populate('city', 'name')
            .populate('country', 'name')
            .exec();

        if (!address) {
            return res.status(404).send('Address not found');
        }

        const totalAmount = products.reduce((total, product) => {
            const priceToUse = product.salePrice ? product.salePrice : product.price;
            return total + priceToUse;
        }, 0);

        const shippingCost = 2;
        const totalWithShipping = totalAmount + shippingCost;

        const order = new Order({
            user: userId,
            products: productIds.map(productId => ({
                product: productId,
                quantity: 1,
                price: products.find(product => product._id.equals(productId)).salePrice || products.find(product => product._id.equals(productId)).price
            })),
            address: addressId,
            totalAmount: totalWithShipping,
            paymentStatus: 'pending',
            paymentMethod: 'cash',
        });

        await order.save();

        await Promise.all(
            products.map(async (product) => {
                if (product.inventoryCount > 0) {
                    product.inventoryCount -= 1;
                    await product.save();
                } else {
                    throw new Error(`Product ${product.name} is out of stock.`);
                }
            })
        );

        res.json({ success: true, message: 'Order created successfully. Please pay with cash on delivery.' });
    } catch (error) {
        console.error('Error processing cash order', error);
        res.status(500).json({ error: 'Server error', details: error.message });
    }
};

const getAllOrders = async (req, res) => {
    const requestingUser = await User.findById(req.user.userId).populate('role');
    if (requestingUser.role.name !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    try {
        const orders = await Order.find()
            .populate('user', 'firstName lastName email')
            .populate('products.product', 'name price')
            .populate('address', 'name street phoneNumber city country');

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders', error);
        res.status(500).send('Server error');
    }
};

const getUserOrders = async (req, res) => {
    try {
        const userId = req.params.userId;

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
    try {
        const { orderId } = req.params;

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
        console.error('Error fetching order:', error);
        res.status(500).json({ success: false, message: 'Error fetching order.' });
    }
};

const updateDeliveryStatus = async (req, res) => {
    const requestingUser = await User.findById(req.user.userId).populate('role');
    if (requestingUser.role.name !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    try {
        const { orderId, status, paymentStatus } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({ success: false, message: 'orderId and status are required.' });
        }

        const order = await Order.findById(orderId).populate('products.product');

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

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

        res.json({ success: true, message: 'Order updated successfully', order });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ success: false, message: 'Error updating order.' });
    }
};

const deleteOrders = async (req, res) => {
    const requestingUser = await User.findById(req.user.userId).populate('role');
    if (requestingUser.role.name !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

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