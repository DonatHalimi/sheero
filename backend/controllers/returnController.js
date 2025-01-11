const ReturnRequest = require('../models/ReturnRequest');

const createReturnRequest = async (req, res) => {
    const { orderId, productIds, reason, customReason } = req.body;
    const userId = req.user.userId;

    try {
        const returnRequest = new ReturnRequest({
            order: orderId,
            products: productIds,
            user: userId,
            reason,
            customReason: reason === 'Other' ? customReason : undefined
        });

        await returnRequest.save();
        res.status(201).json({ message: 'Return request submitted successfully', returnRequest });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const manageReturnRequest = async (req, res) => {
    const { requestId, status } = req.body;

    try {
        const returnRequest = await ReturnRequest.findById(requestId);

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
            .populate('user', 'email')
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
            .populate('products', 'name price image')
            .populate({ path: 'order', select: 'status' })
            .populate({ path: 'user', select: '_id firstName lastName email' })
            .exec();

        res.json({ success: true, data: returnRequest });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getReturnRequestsByUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const returnRequests = await ReturnRequest.find({ user: userId })
            .populate({ path: 'products', select: 'name image' })
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