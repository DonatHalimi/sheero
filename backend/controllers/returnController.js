const { returnEmailQueue } = require('../config/email/queues');
const ReturnRequest = require('../models/ReturnRequest');

const createReturnRequest = async (req, res) => {
    const { orderId, productIds, reason, customReason } = req.body;
    const userId = req.user?.userId;

    if (!orderId || !productIds?.length || !userId || !reason) return res.status(400).json({ message: 'Missing required fields' });

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

        res.status(201).json({ success: true, message: 'Return request submitted successfully', returnRequest: savedReturnRequest });

        if (populatedReturnRequest.user?.email) {
            returnEmailQueue.add({ returnRequest: populatedReturnRequest })
        } else {
            console.warn(`Return request ${savedReturnRequest._id} has no associated email.`);
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating return request', error: error.message });
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

        res.json({
            success: true,
            message: `The status of Return Request #${requestId} has been successfully updated from '${previousStatus}' to '${status}'. Click to copy the return request ID.`,
            savedReturnRequest,
        });

        if (populatedReturnRequest.user?.email) {
            returnEmailQueue.add({ returnRequest: populatedReturnRequest })
        } else {
            console.warn(`Return request ${requestId} has no email; skipping queue`);
        }

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating return request', error: error.message });
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
        res.status(500).json({ success: false, message: 'Error getting return requests', error: error.message });
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
        res.status(500).json({ success: false, message: 'Error getting return request', error: error.message });
    }
};

const getUserReturnRequests = async (req, res) => {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;
    const searchTerm = req.query.search || '';
    const statusFilter = req.query.status || '';

    try {
        const authUserId = req.user.userId.toString();
        const requestedUserId = userId.toString();
        const userRole = req.user.role;

        if (requestedUserId !== authUserId && userRole !== 'admin') return res.status(403).json({ success: false, message: 'Unauthorized access to user return requests' });

        let query = { user: userId };

        if (statusFilter && statusFilter !== 'all') query.status = statusFilter;

        if (searchTerm) {
            const returns = await ReturnRequest.find(query)
                .populate({ path: 'products', select: 'name image slug' })
                .populate({ path: 'order', select: 'status' })
                .populate({ path: 'user', select: '_id firstName lastName email' })
                .sort({ createdAt: -1 })
                .lean()
                .exec();

            const filteredReturns = returns.filter(returnI => {
                const searchLower = searchTerm.toLowerCase();

                const returnFieldsMatch = (
                    returnI._id.toString().toLowerCase().includes(searchLower) ||
                    returnI.status?.toLowerCase().includes(searchLower) ||
                    returnI.reason?.toLowerCase().includes(searchLower) ||
                    returnI.customReason?.toLowerCase().includes(searchLower)
                );

                const productFieldsMatch = returnI.products.some(({ product }) => {
                    if (!product) return false;
                    return (
                        product.name?.toLowerCase().includes(searchLower)
                    );
                });

                return returnFieldsMatch || productFieldsMatch;
            });

            const sortedReturns = filteredReturns.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const totalReturns = sortedReturns.length;
            const paginatedReturns = sortedReturns.slice(skip, skip + limit);

            const totalPages = Math.ceil(totalReturns / limit);
            const hasNextPage = page < totalPages;
            const hasPreviousPage = page > 1;

            return res.json({
                success: true,
                returns: paginatedReturns,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalReturns,
                    hasNextPage,
                    hasPreviousPage,
                    limit
                }
            });
        }

        const totalReturns = await ReturnRequest.countDocuments(query);

        const returns = await ReturnRequest.find(query)
            .populate({ path: 'products', select: 'name image slug' })
            .populate({ path: 'order', select: 'status' })
            .populate({ path: 'user', select: '_id firstName lastName email' })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean()
            .exec();

        const totalPages = Math.ceil(totalReturns / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        res.json({
            success: true,
            returns,
            pagination: {
                currentPage: page,
                totalPages,
                totalReturns,
                hasNextPage,
                hasPreviousPage,
                limit
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching user return requests', error: error.message });
    }
};

const deleteReturnRequest = async (req, res) => {
    try {
        await ReturnRequest.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Return request deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting return request', error: error.message });
    }
};

const deleteReturnRequests = async (req, res) => {
    const { ids } = req.body;

    try {
        await ReturnRequest.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ success: true, message: 'Return requests deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting return requests', error: error.message });
    }
};

module.exports = { createReturnRequest, manageReturnRequest, getAllReturnRequests, getReturnRequestById, getUserReturnRequests, deleteReturnRequest, deleteReturnRequests };