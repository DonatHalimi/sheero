const Address = require('../models/Address');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { orderEmailQueue } = require('../config/email/queues');
const { frontendUrl, stripe } = require('../config/core/utils');
const Notification = require('../models/Notification');
const Role = require('../models/Role');
const User = require('../models/User');

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
            products: await Promise.all(cart.items.map(async (item) => {
                const currentInventory = item.product.inventoryCount;
                const projectedInventory = currentInventory - item.quantity;

                if (currentInventory < item.quantity) {
                    throw new Error(`Product ${item.product.name} is out of stock.`);
                }

                return {
                    product: item.product._id,
                    quantity: item.quantity,
                    price: item.product.salePrice || item.product.price,
                    previousInventory: currentInventory,
                    updatedInventory: projectedInventory,
                    inventoryUpdated: false
                };
            })),
            address: addressId,
            totalAmount: totalWithShipping,
            paymentStatus: 'pending',
            paymentMethod: 'stripe',
            paymentIntentId: 'pending',
            status: 'pending'
        });

        await order.save();

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
        res.status(500).json({ success: false, error: 'Error processing stripe payment', error: error.message });
    }
};

const getOrderNotificationData = (order, additionalData = {}) => ({
    orderId: order._id.toString(),
    orderStatus: order.status,
    products: order.products.map(p => ({
        productName: p.product?.name || 'N/A',
        productImage: p.product?.image || null,
        productId: p.product?._id || null,
        quantity: p.quantity,
        price: p.price,
        previousInventory: p.previousInventory,
        updatedInventory: p.updatedInventory,
    })),
    user: {
        firstName: order.user?.firstName || 'Customer',
        lastName: order.user?.lastName || '',
        email: order.user?.email || '',
        profilePicture: order.user?.profilePicture || null,
    },
    address: {
        name: order.address.name,
        street: order.address.street,
        phoneNumber: order.address.phoneNumber,
        country: order.address.country.name,
        city: order.address.city.name
    },
    total: order.totalAmount,
    createdAt: order.createdAt,
    ...additionalData
});

const notifyOrderManagers = async (io, order) => {
    const role = await Role.findOne({ name: 'orderManager' });
    if (!role) return;

    const managers = await User.find({ role: role._id });
    const notificationData = getOrderNotificationData(order);

    for (const mgr of managers) {
        const notif = await Notification.create({
            user: mgr._id,
            type: 'newOrder',
            isRead: false,
            data: notificationData
        });

        io.to(`user:${mgr._id}`).emit('notification', notif);
    }
};

const verifyOrder = async (req, res) => {
    const { order_id, success } = req.body;
    const isSuccess = String(success) === 'true';
    const io = req.app.get('io');

    try {
        if (!order_id) return res.json({ success: false, sessionValid: false, message: 'Missing order ID' });

        const existingOrder = await Order.findById(order_id);
        if (!existingOrder) return res.json({ success: false, sessionValid: true, message: 'Order not found. Treating payment as cancelled' });

        if (!isSuccess) {
            await Order.findByIdAndDelete(order_id);
            return res.json({ success: false, sessionValid: true, message: 'Payment cancelled. Order deleted' });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            order_id,
            { paymentStatus: 'completed' },
            { new: true }
        )
            .populate('user')
            .populate('products.product')
            .populate({
                path: 'address',
                populate: [
                    { path: 'city', select: 'name zipCode' },
                    { path: 'country', select: 'name' }
                ]
            });

        await orderEmailQueue.add({ order: updatedOrder });

        await notifyOrderManagers(io, updatedOrder);

        return res.json({ success: true, sessionValid: true, message: 'Payment completed successfully', order: updatedOrder });
    } catch (error) {
        return res.status(500).json({ success: false, sessionValid: false, message: 'Error verifying payment', error: error.message });
    }
};

const payWithCash = async (req, res) => {
    const { cartId, addressId, userId } = req.body;
    const io = req.app.get('io');

    try {
        const cart = await Cart.findById(cartId).populate('items.product');
        const address = await Address.findById(addressId)
            .populate('city', 'name zipCode')
            .populate('country', 'name');

        if (!cart || !address) return res.status(404).send('Cart or address not found');

        const subtotal = await cart.calculateTotalPrice();
        const shippingCost = 2;
        const totalAmount = subtotal + shippingCost;

        const order = new Order({
            user: userId,
            products: await Promise.all(cart.items.map(async (item) => {
                const currentInventory = item.product.inventoryCount;
                const projectedInventory = currentInventory - item.quantity;

                if (currentInventory < item.quantity) {
                    throw new Error(`Product ${item.product.name} is out of stock.`);
                }

                return {
                    product: item.product._id,
                    quantity: item.quantity,
                    price: item.product.salePrice || item.product.price,
                    previousInventory: currentInventory,
                    updatedInventory: projectedInventory,
                    inventoryUpdated: false
                };
            })),
            address: addressId,
            totalAmount: totalAmount,
            paymentStatus: 'pending',
            paymentMethod: 'cash',
            status: 'pending'
        });

        await order.save();

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

        await orderEmailQueue.add({ order: populatedOrder });

        await notifyOrderManagers(io, populatedOrder);

        res.status(200).json({ success: true, message: 'Order created successfully. Please pay with cash on delivery', order: populatedOrder });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error creating order', error: error.message });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .lean()
            .populate('user', 'firstName lastName email')
            .populate('updatedBy', 'firstName lastName email')
            .populate('products.product', 'name price salePrice inventoryCount image slug')
            .populate({
                path: 'address',
                select: 'name street phoneNumber city country comment',
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
        res.status(500).json({ success: false, message: 'Error fetching orders', error: error.message });
    }
};

const getUserOrders = async (req, res) => {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;
    const searchTerm = req.query.search || '';
    const statusFilter = req.query.status || '';

    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const authUserId = req.user.userId.toString();
        const requestedUserId = userId.toString();
        const userRole = req.user.role;

        if (requestedUserId !== authUserId && userRole !== 'admin') return res.status(403).json({ success: false, message: 'Unauthorized access to user orders' });

        let query = { user: userId };

        if (statusFilter && statusFilter !== 'all') query.status = statusFilter;

        if (searchTerm) {
            const orders = await Order.find(query)
                .populate('products.product', 'name price image slug')
                .populate('address', 'name street phoneNumber city country')
                .lean()
                .exec();

            const filteredOrders = orders.filter(order => {
                const searchLower = searchTerm.toLowerCase();

                const orderFieldsMatch = (
                    order._id.toString().toLowerCase().includes(searchLower) ||
                    order.paymentStatus?.toLowerCase().includes(searchLower) ||
                    order.paymentMethod?.toLowerCase().includes(searchLower) ||
                    order.paymentIntentId?.toLowerCase().includes(searchLower) ||
                    order.status?.toLowerCase().includes(searchLower) ||
                    order.totalAmount?.toString().includes(searchTerm)
                );

                const productFieldsMatch = order.products.some(({ product, quantity, price }) => {
                    if (!product) return false;
                    return (
                        product.name?.toLowerCase().includes(searchLower) ||
                        quantity?.toString().includes(searchTerm) ||
                        price?.toString().includes(searchTerm)
                    );
                });

                return orderFieldsMatch || productFieldsMatch;
            });

            const sortedOrders = filteredOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const totalOrders = sortedOrders.length;
            const paginatedOrders = sortedOrders.slice(skip, skip + limit);

            const totalPages = Math.ceil(totalOrders / limit);
            const hasNextPage = page < totalPages;
            const hasPreviousPage = page > 1;

            return res.json({
                success: true,
                orders: paginatedOrders,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalOrders,
                    hasNextPage,
                    hasPreviousPage,
                    limit
                }
            });
        }

        const totalOrders = await Order.countDocuments(query);

        const orders = await Order.find(query)
            .populate('products.product', 'name price image slug')
            .populate('address', 'name street phoneNumber city country')
            .skip(skip)
            .limit(limit)
            .lean()
            .sort({ createdAt: -1 })
            .exec();

        const totalPages = Math.ceil(totalOrders / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        res.json({
            success: true,
            orders,
            pagination: {
                currentPage: page,
                totalPages,
                totalOrders,
                hasNextPage,
                hasPreviousPage,
                limit
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching user orders', error: error.message });
    }
};

const getOrderById = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await Order.findById(orderId)
            .select('-updatedBy')
            .populate('products.product', 'name price image slug')
            .populate({
                path: 'address',
                select: 'name phoneNumber street comment',
                populate: [
                    { path: 'city', select: 'name zipCode' },
                    { path: 'country', select: 'name' }
                ]
            })
            .exec();

        const orderUserId = order.user.toString();
        const authUserId = req.user.userId.toString();

        if (orderUserId !== authUserId) return res.status(403).json({ success: false, message: 'Unauthorized access to order details' });

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching order', error: error.message });
    }
};

const updateDeliveryStatus = async (req, res) => {
    const { orderId, status, paymentStatus } = req.body;
    const io = req.app.get('io');

    try {
        if (!orderId || !status) return res.status(400).json({ success: false, message: 'Order ID and status are required' });

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

        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        const prevStatus = order.status;
        const isProcessed = status === 'processed' && prevStatus !== 'processed';
        const isCanceled = status === 'canceled' && prevStatus !== 'canceled';

        if (isProcessed || isCanceled) {
            await Promise.all(order.products.map(async (orderProduct) => {
                const product = await Product.findById(orderProduct.product._id);
                if (!product) return;

                if (isProcessed && !orderProduct.inventoryUpdated) {
                    product.inventoryCount -= orderProduct.quantity;
                    orderProduct.inventoryUpdated = true;
                } else if (isCanceled && orderProduct.inventoryUpdated) {
                    product.inventoryCount += orderProduct.quantity;
                    orderProduct.inventoryUpdated = false;
                }

                await product.save();
            }));
        }

        order.status = status;
        order.updatedBy = req.user.userId;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        if (status === 'delivered') {
            const now = new Date();
            order.arrivalDateRange = { start: now, end: now };
        } else if (status === 'canceled') {
            order.arrivalDateRange = { start: null, end: null };
        }

        await order.save();
        await order.populate({
            path: 'updatedBy',
            select: 'firstName lastName role email',
            populate: { path: 'role', select: 'name' }
        });

        if (status !== prevStatus) {
            const role = await Role.findOne({ name: 'orderManager' });
            if (role) {
                const managers = await User.find({ role: role._id });

                for (const mgr of managers) {
                    const updatedNotif = await Notification.findOneAndUpdate(
                        {
                            'data.orderId': order._id.toString(),
                            user: mgr._id,
                            type: 'newOrder'
                        },
                        {
                            $set: {
                                'data.orderStatus': status,
                                'data.updatedAt': new Date(),
                                isRead: false
                            }
                        },
                        { new: true }
                    );

                    if (updatedNotif) {
                        io.to(`user:${mgr._id}`).emit('notification', updatedNotif);
                    }
                }
            }
        }

        res.json({
            success: true,
            message: `The status of order #${orderId} has been successfully updated from '${prevStatus}' to '${status}'. Click to copy the order ID`,
            order,
        });

        if (order.user && order.user.email) {
            await orderEmailQueue.add({ order: order });
        } else {
            console.warn(`Order ${orderId} has no user email associated.`);
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating order', error: error.message });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        await Order.findByIdAndDelete(orderId);

        await Notification.deleteMany({ 'data.orderId': orderId });

        res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting order', error: error.message });
    }
};

const deleteOrders = async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) return res.status(400).json({ message: 'Invalid or empty ids array' });

    try {
        const orders = await Order.find({ _id: { $in: ids } });

        if (orders.length !== ids.length) return res.status(404).json({ message: 'One or more orders not found' });

        await Order.deleteMany({ _id: { $in: ids } });

        await Notification.deleteMany({ 'data.orderId': { $in: ids } });

        res.status(200).json({ success: true, message: 'Orders deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting orders', error: error.message });
    }
};

module.exports = { payWithStripe, verifyOrder, payWithCash, getAllOrders, getUserOrders, getOrderById, updateDeliveryStatus, deleteOrder, deleteOrders };