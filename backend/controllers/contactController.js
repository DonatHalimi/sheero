const Contact = require('../models/Contact');

const createContact = async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        const contact = new Contact({ name, email, subject, message });
        await contact.save();
        res.status(201).json({ message: 'Message sent succesfully', contact });
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