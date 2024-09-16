const Contact = require('../models/Contact');

const createContact = async (req, res) => {
    const { name, email, subject, message } = req.body;
    try {
        const contact = new Contact({ name, email, subject, message });
        await contact.save();
        res.status(201).json(contact);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createContact, getContacts };