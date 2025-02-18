const { sendContactEmail, sendContactEmailToAdmins } = require('../config/emailService');
const Contact = require('../models/Contact');

const sendContactDetailsEmail = async (contact) => {
    try {
        await sendContactEmail(contact);
        await sendContactEmailToAdmins(contact); // TODO: add role 'customerSupport' so that users with this role can receive emails of every contact details 
    } catch (error) {
        console.error(`Failed to send contact email to ${contact.email}:`, error);
    }
};

const createContact = async (req, res) => {
    const { name, email, subject, message, userId } = req.body;

    try {
        const contact = new Contact({ name, email, subject, message, userId });
        await contact.save();

        sendContactDetailsEmail(contact);

        res.status(201).json({ message: 'Thank you for reaching out! We have received your message and will contact you as soon as possible. Please check your inbox for our response', contact });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find().populate('userId', 'firstName lastName email');
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