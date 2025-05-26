const Notification = require("../models/Notification");

const getNotifications = async (req, res) => {
    try {
        const notifs = await Notification
            .find({ user: req.user.userId, isArchived: false })
            .sort('-createdAt');
        res.json(notifs);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getArchivedNotifications = async (req, res) => {
    try {
        const notifs = await Notification
            .find({ user: req.user.userId, isArchived: true })
            .sort('-createdAt');
        res.json(notifs);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            user: req.user.userId,
        });

        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        if (notification.isRead) return res.status(400).json({ success: false, message: 'Notification is already marked as read' });

        notification.isRead = true;
        await notification.save();

        res.status(200).json({ success: true, message: 'Notification marked as read successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const markAsUnread = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            user: req.user.userId,
        });

        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        if (!notification.isRead) return res.status(400).json({ success: false, message: 'Notification is already marked as unread' });

        notification.isRead = false;
        await notification.save();

        res.status(200).json({ success: true, message: 'Notification marked as unread successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.userId, isRead: false });

        if (!notifications.length) return res.status(400).json({ success: false, message: 'All notifications are already marked as read' });

        await Promise.all(notifications.map(async (notification) => {
            notification.isRead = true;
            await notification.save();
        }));

        res.status(200).json({ success: true, message: 'All notifications marked as read successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const markAllAsUnread = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.userId, isRead: true });

        if (!notifications.length) return res.status(400).json({ success: false, message: 'All notifications are already marked as unread' });

        await Promise.all(notifications.map(async (notification) => {
            notification.isRead = false;
            await notification.save();
        }));

        res.status(200).json({ success: true, message: 'All notifications marked as unread successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const archiveNotification = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            user: req.user.userId,
        }).populate('data.orderId', 'orderId');

        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        if (notification.isArchived) return res.status(400).json({
            success: false,
            message: `Order #${notification.data.orderId} is already archived`
        });

        notification.isArchived = true;
        await notification.save();

        res.status(200).json({ success: true, message: `Notification for order #${notification.data.orderId} archived successfully` });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

const unarchiveNotification = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            user: req.user.userId,
        }).populate('data.orderId', 'orderId');

        if (!notification) return res.status(404).json({ message: 'Notification not found' });

        if (!notification.isArchived) return res.status(400).json({
            success: false,
            message: `Order #${notification.data.orderId} is not archived`
        });

        notification.isArchived = false;
        await notification.save();

        res.status(200).json({ success: true, message: `Notification for order #${notification.data.orderId} restored successfully` });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getNotifications, getArchivedNotifications, markAsRead, markAsUnread, markAllAsRead, markAllAsUnread, archiveNotification, unarchiveNotification };