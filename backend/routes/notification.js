const express = require('express');
const {
    getNotifications, getArchivedNotifications, markAsRead, markAsUnread, archiveNotification,
    markAllAsUnread, markAllAsRead, unarchiveNotification, archiveAll, unarchiveAll
} = require('../controllers/notificationController');
const { requireAuthAndRole } = require('../middleware/auth');
const router = express.Router();

router.get('/get', requireAuthAndRole('orderManager'), getNotifications);
router.get('/get/archived', requireAuthAndRole('orderManager'), getArchivedNotifications);
router.put('/read/:id', requireAuthAndRole('orderManager'), markAsRead);
router.put('/unread/:id', requireAuthAndRole('orderManager'), markAsUnread);
router.put('/read-all', requireAuthAndRole('orderManager'), markAllAsRead);
router.put('/unread-all', requireAuthAndRole('orderManager'), markAllAsUnread);
router.put('/archive/:id', requireAuthAndRole('orderManager'), archiveNotification);
router.put('/unarchive/:id', requireAuthAndRole('orderManager'), unarchiveNotification);
router.put('/archive-all', requireAuthAndRole('orderManager'), archiveAll);
router.put('/unarchive-all', requireAuthAndRole('orderManager'), unarchiveAll);

module.exports = router;