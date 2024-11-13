const ReturnRequest = require('../models/ReturnRequest');
const Order = require('../models/Order');

const createReturnRequest = async (req, res) => {
    const { orderId, productIds, reason, customReason } = req.body;
    const userId = req.user.userId;

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.user.toString() !== userId) {
            return res.status(403).json({ message: 'Order does not belong to the user' });
        }

        if (order.status !== 'delivered') {
            return res.status(400).json({ message: 'Order is not eligible for return as it is not delivered' });
        }

        // Check if all the products are in the order
        const invalidProducts = productIds.filter(productId =>
            !order.products.find(p => p.product.toString() === productId)
        );
        if (invalidProducts.length > 0) {
            return res.status(404).json({ message: 'Some products were not found in the order' });
        }

        // Check if a return request already exists for any of the products
        const existingReturnRequests = await ReturnRequest.find({
            order: orderId,
            user: userId,
            products: { $in: productIds }
        });

        if (existingReturnRequests.length > 0) {
            return res.status(400).json({ message: 'Return request already made for one or more of these products' });
        }

        if (reason === 'Other' && !customReason) {
            return res.status(400).json({ message: 'Custom reason is required when "Other" is selected.' });
        }

        // Create a return request with multiple products
        const returnRequest = new ReturnRequest({
            order: orderId,
            products: productIds,
            user: userId,
            reason,
            customReason: reason === 'Other' ? customReason : undefined
        });

        await returnRequest.save();
        res.json({ message: 'Return request submitted successfully', returnRequest });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const manageReturnRequest = async (req, res) => {
    const { requestId, status } = req.body;

    try {
        const returnRequest = await ReturnRequest.findById(requestId);
        if (!returnRequest) {
            return res.status(404).json({ message: 'Return request not found' });
        }

        returnRequest.status = status;
        await returnRequest.save();

        res.json({ message: `Return request ${status} successfully`, returnRequest });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllReturnRequests = async (req, res) => {
    try {
        const returnRequests = await ReturnRequest.find()
            .populate('products', 'name')
            .populate('user', 'email');
        res.json({ returnRequests });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getReturnRequestById = async (req, res) => {
    try {
        const { returnId } = req.params;

        const returnRequest = await ReturnRequest.findById(returnId)
            .populate('products', 'name price image')
            .populate({ path: 'order', select: 'status' })
            .populate({ path: 'user', select: '_id firstName lastName email' })
            .exec();

        if (!returnRequest) {
            return res.status(404).json({ success: false, message: 'Return request not found.' });
        }

        res.json({ success: true, data: returnRequest });
    } catch (error) {
        console.error(error);  // Log error for debugging
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getReturnRequestsByUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const returnRequests = await ReturnRequest.find({ user: userId })
            .populate({
                path: 'products',
                select: 'name description price salePrice category subcategory image inventoryCount'
            })
            .populate({
                path: 'order',
                select: 'status'
            })
            .populate({
                path: 'user',
                select: '_id firstName lastName email'
            })
            .sort({ createdAt: -1 })
            .exec();

        if (returnRequests.length === 0) {
            return res.status(404).json({ message: 'No return requests found for this user' });
        }

        res.status(200).json(returnRequests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteReturnRequest = async (req, res) => {
    try {
        const returnRequest = await ReturnRequest.findByIdAndDelete(req.params.id);
        if (!returnRequest) {
            return res.status(404).json({ message: 'Return request not found' });
        }
        res.status(200).json({ message: 'Return request deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteReturnRequests = async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Invalid or empty ids array' });
    }

    try {
        const returnRequests = await ReturnRequest.find({ _id: { $in: ids } });

        if (returnRequests.length !== ids.length) {
            return res.status(404).json({ message: 'One or more return requests not found' });
        }

        await ReturnRequest.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ message: 'Return requests deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createReturnRequest, manageReturnRequest, getAllReturnRequests, getReturnRequestById, getReturnRequestsByUser, deleteReturnRequest, deleteReturnRequests };