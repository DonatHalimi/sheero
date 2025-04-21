const { sendReturnRequestUpdateEmail } = require('../config/email/emailService');
const ReturnRequest = require('../models/ReturnRequest');

const createReturnRequest = async (req, res) => {
    const { orderId, productIds, reason, customReason } = req.body;
    const userId = req.user?.userId;

    if (!orderId || !productIds?.length || !userId || !reason) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const returnRequest = new ReturnRequest({
            order: orderId,
            products: productIds,
            user: userId,
            reason,
            customReason: reason === 'Other' ? customReason : undefined
        });

        const savedReturnRequest = await returnRequest.save();

        const populatedReturnRequest = await ReturnRequest.findById(savedReturnRequest._id)
            .populate('user')
            .populate('products');

        if (populatedReturnRequest.user?.email) {
            await sendReturnRequestUpdateEmail(populatedReturnRequest);
        } else {
            console.warn(`Return request ${savedReturnRequest._id} has no associated email.`);
        }

        res.status(201).json({ message: 'Return request submitted successfully', returnRequest: savedReturnRequest });
    } catch (error) {
        console.error('Error creating return request:', error);
        res.status(500).json({ message: error.message || 'An unexpected error occurred' });
    }
};

const manageReturnRequest = async (req, res) => {
    const { requestId, status } = req.body;

    try {
        const returnRequest = await ReturnRequest.findById(requestId);

        const previousStatus = returnRequest.status;

        returnRequest.status = status;
        returnRequest.updatedBy = req.user.userId;

        const savedReturnRequest = await returnRequest.save();
        if (!savedReturnRequest || !savedReturnRequest._id) {
            throw new Error('Failed to save return request');
        }

        const populatedReturnRequest = await ReturnRequest.findById(savedReturnRequest._id)
            .populate('user')
            .populate('products');

        if (!populatedReturnRequest) return res.status(404).json({ message: 'Return request not found after saving' });

        if (populatedReturnRequest.user?.email) {
            await sendReturnRequestUpdateEmail(populatedReturnRequest);
        } else {
            console.warn(`Return request ${savedReturnRequest._id} has no associated email.`);
        }

        res.json({
            success: true,
            message: `The status of Return Request #${requestId} has been successfully updated from '${previousStatus}' to '${status}'. Click to copy the return request ID.`,
            savedReturnRequest,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllReturnRequests = async (req, res) => {
    try {
        const returnRequests = await ReturnRequest.find()
            .populate('products', '_id name price salePrice inventoryCount image slug')
            .populate('updatedBy', 'firstName lastName email')
            .populate('user', '_id email firstName lastName')
            .sort({ createdAt: -1 });

        res.json({ returnRequests });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getReturnRequestById = async (req, res) => {
    const { returnId } = req.params;

    try {
        const returnRequest = await ReturnRequest.findById(returnId)
            .populate('products', 'name price image slug')
            .populate({ path: 'order', select: 'status' })
            .populate({ path: 'user', select: '_id firstName lastName email' })
            .exec();

        const returnRequestUserId = returnRequest.user._id.toString();
        const authUserId = req.user.userId.toString();

        if (returnRequestUserId !== authUserId) return res.status(403).json({ success: false, message: 'Unauthorized access to return request details.' });

        res.json({ success: true, data: returnRequest });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getReturnRequestsByUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const returnRequests = await ReturnRequest.find({ user: userId })
            .populate({ path: 'products', select: 'name image slug' })
            .populate({ path: 'order', select: 'status' })
            .populate({ path: 'user', select: '_id firstName lastName email' })
            .sort({ createdAt: -1 })
            .exec();

        res.json(returnRequests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteReturnRequest = async (req, res) => {
    try {
        await ReturnRequest.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Return request deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteReturnRequests = async (req, res) => {
    const { ids } = req.body;

    try {
        await ReturnRequest.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: 'Return requests deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createReturnRequest, manageReturnRequest, getAllReturnRequests, getReturnRequestById, getReturnRequestsByUser, deleteReturnRequest, deleteReturnRequests };