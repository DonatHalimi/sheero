const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');

const createUser = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const validRole = role ? await Role.findById(role) : await Role.findOne({ name: 'user' });

    try {
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: validRole._id,
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully', newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find().populate('role', 'name');
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: 'User updated successfully', updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteUsers = async (req, res) => {
    const { ids } = req.body;

    try {
        await User.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ message: 'Users deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser, deleteUsers };