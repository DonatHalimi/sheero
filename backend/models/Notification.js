const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['newOrder'], required: true },
    data: { type: mongoose.Mixed },
    isRead: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);