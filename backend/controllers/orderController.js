const express = require('express');
const Product = require('../models/Product');
const Address = require('../models/Address');
const Order = require('../models/Order');
const dotenv = require('dotenv');
const Stripe = require('stripe');

// TODO (MAYBE) (WEBHOOK):
// const { buffer } = require('micro');
// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe Checkout Session
const checkoutSession = async (req, res) => {
    try {
        const { productIds, addressId, userId, email } = req.body;

        // Fetch product details
        const products = await Product.find({ '_id': { $in: productIds } });

        // Fetch user's address
        const address = await Address.findById(addressId)
            .populate('city', 'name')
            .populate('country', 'name')
            .exec();

        // Check if address exists
        if (!address) {
            return res.status(404).send('Address not found');
        }

        // Prepare Stripe line items
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

        // Total amount calculation
        const totalAmount = products.reduce((total, product) => {
            const priceToUse = product.salePrice ? product.salePrice : product.price;
            return total + priceToUse;
        }, 0);

        const shippingCost = 2;
        const totalWithShipping = totalAmount + shippingCost;

        // Add a shipping line item if needed
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

        // Create the order in the database
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

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `http://localhost:3000/verify?success=true&session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
            cancel_url: `http://localhost:3000/verify?success=false&session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
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

        // Update the order with the Stripe session ID
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
        if (success === true) {
            await Order.findByIdAndUpdate(order_id, { paymentStatus: 'completed' });
            res.json({ success: true, message: 'Payment completed successfully.' });
        } else {
            await Order.findByIdAndDelete(order_id); // Delete the order if payment fails
            res.json({ success: false, message: 'Payment failed. Order has been deleted.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred during verification.' });
    }
};

// Get all orders
const getAllOrders = async (req, res) => {
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
            .exec();

        // Check if orders exist
        if (!orders.length) {
            return res.json({ success: false, message: 'No orders found for this user.' });
        }

        res.json({ success: true, data: orders });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ success: false, message: 'Error fetching orders.' });
    }
};

const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Find the order by ID
        const order = await Order.findById(orderId)
            .populate('products.product', 'name price image')
            .populate({
                path: 'address',
                select: 'name phoneNumber street',
                populate: [
                    { path: 'city', select: 'name zipCode' },
                    { path: 'country', select: 'name' }
                ]
            })
            .exec();

        // Check if the order exists
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
    try {
        const { orderId, status } = req.body;

        // Check if orderId and status are provided
        if (!orderId || !status) {
            return res.status(400).json({ success: false, message: 'orderId and status are required.' });
        }

        // Update the order delivery status to the new status field
        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true }); // Update status field

        // Check if order exists
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found.' });
        }

        res.json({ success: true, message: 'Delivery status updated successfully.', order });
    } catch (error) {
        console.error('Error updating delivery status:', error);
        res.status(500).json({ success: false, message: 'Error updating delivery status.' });
    }
};

const deleteOrders = async (req, res) => {
    const { ids } = req.body;

    // Validate the input
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Invalid or empty ids array' });
    }

    try {
        // Check if all orders exist
        const orders = await Order.find({ _id: { $in: ids } });

        if (orders.length !== ids.length) {
            return res.status(404).json({ message: 'One or more orders not found' });
        }

        // Delete the orders
        await Order.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ message: 'Orders deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// TODO (MAYBE) (WEBHOOK HANDLER):
// const handleStripeWebhook = async (req, res) => {
//     const sig = req.headers['stripe-signature'];

//     let event;

//     try {
//         event = stripe.webhooks.constructEvent(await buffer(req), sig, webhookSecret);
//     } catch (err) {
//         console.error(`Webhook Error: ${err.message}`);
//         return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     // Handle the event based on its type
//     switch (event.type) {
//         case 'checkout.session.completed':
//             const session = event.data.object; // Contains the checkout session object
//             const orderId = session.metadata.orderId; // Get the order ID from metadata

//             // Update the order status to 'paid'
//             await Order.findByIdAndUpdate(orderId, { paymentStatus: 'paid' });

//             console.log(`Order ${orderId} payment successful`);
//             break;

//         // Other event types can be handled here as needed
//         default:
//             console.log(`Unhandled event type ${event.type}`);
//     }

//     // Respond to acknowledge receipt of the event
//     res.json({ received: true });
// };

// // Add this route in your Express app
// app.post('/webhook', express.json({ verify: (req, res, buf) => {
//     req.rawBody = buf.toString();
// }}), handleStripeWebhook);

module.exports = { checkoutSession, verifyOrder, getAllOrders, getUserOrders, getOrderById, updateDeliveryStatus, deleteOrders };