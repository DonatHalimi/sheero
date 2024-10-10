const Contact = require('../models/Contact');
const User = require('../models/User');

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
    const requestingUser = await User.findById(req.user.userId).populate('role');
    if (requestingUser.role.name !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    try {
        const contact = await Contact.findById(req.params.id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        await Contact.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteContacts = async (req, res) => {
    const requestingUser = await User.findById(req.user.userId).populate('role');
    if (requestingUser.role.name !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Invalid or empty ids array' });
    }

    try {
        const contacts = await Contact.find({ _id: { $in: ids } });

        if (contacts.length !== ids.length) {
            return res.status(404).json({ message: 'One or more contacts not found' });
        }

        await Contact.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ message: 'Contacts deleted successfully' });
    } catch (error) {
        console.error('Error deleting contacts:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


module.exports = { createContact, getContacts, deleteContact, deleteContacts };