const { contactEmailQueue } = require('../config/email/queues');
const Contact = require('../models/Contact');

const createContact = async (req, res) => {
    const { name, email, subject, message, userId } = req.body;

    try {
        const contact = new Contact({ name, email, subject, message, userId });
        await contact.save();

        await contactEmailQueue.add({ contact: contact });

        res.status(201).json({
            success: true,
            message: 'Thank you for reaching out! We have received your message and will contact you as soon as possible. Please check your inbox for our response',
            contact
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating contact', error: error.message });
    }
};

const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().populate('userId', 'firstName lastName email').sort({ createdAt: -1 });
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error getting contacts', error: error.message });
    }
};

const deleteContact = async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting contact', error: error.message });
    }
};

const deleteContacts = async (req, res) => {
    const { ids } = req.body;

    try {
        await Contact.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ success: true, message: 'Contacts deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting contacts', error: error.message });
    }
};

module.exports = { createContact, getContacts, deleteContact, deleteContacts };