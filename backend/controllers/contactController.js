const { contactEmailQueue } = require('../config/email/queues');
const { sendContactEmail, sendContactEmailToCustomerSupport } = require('../config/email/service');
const Contact = require('../models/Contact');

const createContact = async (req, res) => {
    const { name, email, subject, message, userId } = req.body;

    try {
        const contact = new Contact({ name, email, subject, message, userId });
        await contact.save();

        await contactEmailQueue.add({ contact: contact });

        res.status(201).json({ message: 'Thank you for reaching out! We have received your message and will contact you as soon as possible. Please check your inbox for our response', contact });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().populate('userId', 'firstName lastName email').sort({ createdAt: -1 });
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        await Contact.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteContacts = async (req, res) => {
    const { ids } = req.body;

    try {
        await Contact.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ message: 'Contacts deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createContact, getContacts, deleteContact, deleteContacts };