const bcrypt = require('bcryptjs');
const User = require('../models/User');

const createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const existingUser = await User.findOne({ username });
        const existingEmail = await User.findOne({ email });
        if (existingUser || existingEmail) return res.status(400).json({ message: 'Username or Email already exists' });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with the hashed password
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role
        });

        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        // If password is being updated, hash it before saving
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const deleteUsers = async (req, res) => {
    const { userIds } = req.body;
    try {
        const users = await User.find({ _id: { $in: userIds } });

        if (users.length !== userIds.length) {
            return res.status(404).json({ message: 'One or more users not found' });
        }

        await User.deleteMany({ _id: { $in: userIds } });

        res.status(200).json({ message: 'Users deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createUser, getUsers, getUser, updateUser, deleteUser, deleteUsers };