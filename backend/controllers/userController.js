const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');
const Address = require('../models/Address');
const Order = require('../models/Order');
const ReturnRequest = require('../models/ReturnRequest');
const Review = require('../models/Review');

const createUser = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const validRole = role ? await Role.findById(role) : await Role.findOne({ name: 'user' });

    if (!validRole) {
        return res.status(400).json({ message: 'Role does not exist' });
    }

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
    const { firstName, lastName, email, password, role } = req.body;

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (email) {
            const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;
        if (password) user.password = await bcrypt.hash(password, 10);
        if (role) user.role = role;

        await user.save();
        await user.populate('role');

        res.status(200).json({ message: 'User updated successfully', updatedUser: user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
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
        await Promise.all([
            User.deleteMany({ _id: { $in: ids } }),
            Address.deleteMany({ user: { $in: ids } }),
            Order.deleteMany({ user: { $in: ids } }),
            ReturnRequest.deleteMany({ user: { $in: ids } }),
            Review.deleteMany({ user: { $in: ids } })
        ]);

        res.status(200).json({ message: 'Users and related data deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser, deleteUsers };