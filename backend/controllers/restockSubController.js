const { sendProductRestockSubscriptionEmail } = require("../config/email/service");
const Product = require("../models/Product");
const ProductRestockSubscription = require("../models/ProductRestockSubscription");
const User = require("../models/User");

const sendRestockSubscriptionEmail = async (email, product, subscription) => {
    try {
        await sendProductRestockSubscriptionEmail(email, product, subscription);
    } catch (error) {
        console.error(`Failed to send subscription confirmation email to ${email}:`, error);
    }
};

const subscribeForRestock = async (req, res) => {
    const { email } = req.body;
    const productId = req.params.productId;

    if (!email) return res.status(400).json({ message: 'Email is required.' });

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: 'Product not found.' });

        const existingSubscription = await ProductRestockSubscription.findOne({ productId, email });
        if (existingSubscription) {
            return res.status(200).json({
                alreadySubscribed: true,
                message: 'Your email is already subscribed to receive restock notifications for this product'
            });
        }

        const subscription = await ProductRestockSubscription.create({ productId, email });

        res.status(200).json({
            alreadySubscribed: false,
            message: 'You will receive an email when the product is restocked',
            subscription
        });

        sendRestockSubscriptionEmail(email, product, subscription);
    } catch (error) {
        console.error('Error subscribing for restock:', error);
        res.status(500).json({ message: 'Error creating subscription.', error: error.message });
    }
};

const getUserRestockSubscription = async (req, res) => {
    try {
        const email = req.query.email || req.user?.email;
        if (!email) return res.status(400).json({ message: "Email is required" });

        const subscription = await ProductRestockSubscription.findOne({ email });

        res.json({ isSubscribed: !!subscription });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const deleteUserRestockSubscription = async (req, res) => {
    try {
        if (!req.user?.userId) return res.status(400).json({ message: "User ID is required" });

        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const subscription = await ProductRestockSubscription.findOneAndDelete({ email: user.email });

        res.json({ isSubscribed: !!subscription, message: "Product restock subscription deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

const getAllRestockSubscriptions = async (req, res) => {
    try {
        const subscriptions = await ProductRestockSubscription.find()
            .populate('productId', 'name slug image inventoryCount')
            .exec();

        res.status(200).json(subscriptions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching subscriptions.', error: error.message });
    }
};

const deleteRestockSubscription = async (req, res) => {
    try {
        const subscription = await ProductRestockSubscription.findByIdAndDelete(req.params.id);

        if (!subscription) return res.status(404).json({ message: 'Subscription not found' });

        res.status(200).json({ message: 'Subscription deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting subscription.', error: error.message });
    }
};

const deleteRestockSubscriptions = async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) return res.status(400).json({ message: 'Invalid or empty ids array' });

    try {
        const subscriptions = await ProductRestockSubscription.find({ _id: { $in: ids } });

        if (subscriptions.length !== ids.length) {
            return res.status(404).json({ message: 'One or more subscriptions not found' });
        }

        await ProductRestockSubscription.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ message: 'Subscriptions deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting subscriptions.', error: error.message });
    }
};

module.exports = { subscribeForRestock, getUserRestockSubscription, deleteUserRestockSubscription, getAllRestockSubscriptions, deleteRestockSubscription, deleteRestockSubscriptions }