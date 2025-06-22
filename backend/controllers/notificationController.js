const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
    try {
        const notifs = await Notification
            .find({ user: req.user.userId, isArchived: false })
            .sort('-createdAt');
        res.json(notifs);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error getting notifications', error: error.message });
    }
};

const getArchivedNotifications = async (req, res) => {
    try {
        const notifs = await Notification
            .find({ user: req.user.userId, isArchived: true })
            .sort('-createdAt');
        res.json(notifs);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error getting archived notifications', error: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const notif = await Notification.findOne({
            _id: req.params.id,
            user: req.user.userId,
        });

        if (!notif) return res.status(404).json({ success: false, message: 'Notification not found' });

        if (notif.isRead) return res.status(400).json({ success: false, message: 'Notification is already marked as read', data: notif });

        notif.isRead = true;
        await notif.save();

        res.status(200).json({ success: true, message: `Notification for order #${notif.data.orderId} marked as read`, data: notif });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error marking notification as read', error: error.message });
    }
};

const markAsUnread = async (req, res) => {
    try {
        const notif = await Notification.findOne({
            _id: req.params.id,
            user: req.user.userId,
        });

        if (!notif) return res.status(404).json({ success: false, message: 'Notification not found' });

        if (!notif.isRead) return res.status(400).json({ success: false, message: 'Notification is already marked as unread', data: notif });

        notif.isRead = false;
        await notif.save();

        res.status(200).json({ success: true, message: `Notification for order #${notif.data.orderId} marked as unread`, data: notif });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error marking notification as unread', error: error.message });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const query = {
            user: req.user.userId,
            isRead: false,
            ...(req.query.archived === 'true'
                ? { isArchived: true }
                : { isArchived: false })
        };

        const notifs = await Notification.find(query);
        if (!notifs.length) {
            return res.status(400).json({ success: false, message: 'No unread items' });
        }

        await Notification.updateMany(query, { $set: { isRead: true } });
        const message = `${notifs.length} notification${notifs.length > 1 ? 's' : ''} marked as read`;
        res.json({ success: true, message, data: notifs.length });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const markAllAsUnread = async (req, res) => {
    try {
        const query = {
            user: req.user.userId,
            isRead: true,
            ...(req.query.archived === 'true'
                ? { isArchived: true }
                : { isArchived: false })
        };

        const notifs = await Notification.find(query);
        if (!notifs.length) {
            return res.status(400).json({ success: false, message: 'No read items' });
        }

        await Notification.updateMany(query, { $set: { isRead: false } });
        const message = `${notifs.length} notification${notifs.length > 1 ? 's' : ''} marked as unread`;
        res.json({ success: true, message, data: notifs.length });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

const archiveNotification = async (req, res) => {
    try {
        const notif = await Notification.findOne({
            _id: req.params.id,
            user: req.user.userId,
        }).populate('data.orderId', 'orderId');

        if (!notif) return res.status(404).json({ success: false, message: 'Notification not found' });

        if (notif.isArchived) return res.status(400).json({ success: false, message: `Order #${notif.data.orderId} is already archived`, data: notif });

        notif.isArchived = true;
        await notif.save();

        res.status(200).json({ success: true, message: `Notification for order #${notif.data.orderId} archived`, data: notif });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error archiving notification', error: error.message });
    }
};

const unarchiveNotification = async (req, res) => {
    try {
        const notif = await Notification.findOne({
            _id: req.params.id,
            user: req.user.userId,
        }).populate('data.orderId', 'orderId');

        if (!notif) return res.status(404).json({ success: false, message: 'Notification not found' });

        if (!notif.isArchived) return res.status(400).json({ success: false, message: `Order #${notif.data.orderId} is not archived`, data: notif });

        notif.isArchived = false;
        await notif.save();

        res.status(200).json({ success: true, message: `Notification for order #${notif.data.orderId} restored`, data: notif });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error restoring notification', error: error.message });
    }
};

const archiveAll = async (req, res) => {
    try {
        const filter = {
            user: req.user.userId,
            isArchived: false,
            ...(req.query.archived === 'true' ? { isRead: true } : {})
        };

        const result = await Notification.updateMany(filter, { $set: { isArchived: true } });
        const message = `${result.modifiedCount} notification${result.modifiedCount > 1 ? 's' : ''} archived`;
        res.json({ success: true, message, data: result.modifiedCount });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error archiving notifications', error: error.message });
    }
};

const unarchiveAll = async (req, res) => {
    try {
        const filter = {
            user: req.user.userId,
            isArchived: true,
            ...(req.query.archived === 'true' ? { isRead: true } : {})
        };

        const result = await Notification.updateMany(filter, { $set: { isArchived: false } });
        const message = `${result.modifiedCount} notification${result.modifiedCount > 1 ? 's' : ''} restored`;
        res.json({ success: true, message, data: result.modifiedCount });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error restoring notifications', error: error.message });
    }
};

module.exports = { getNotifications, getArchivedNotifications, markAsRead, markAsUnread, markAllAsRead, markAllAsUnread, archiveNotification, unarchiveNotification, archiveAll, unarchiveAll };