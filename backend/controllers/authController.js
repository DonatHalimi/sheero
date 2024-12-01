const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const cookieConfig = require('../config/cookie.config');

const generateAccessToken = (user) => {
    return jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const registerUser = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const validRole = await Role.findById(role) || await Role.findOne({ name: 'user' });

    try {
        const user = new User({ firstName, lastName, email, password: hashedPassword, role: validRole._id });
        await user.save();
        
        res.status(201).json({
            message: 'User registered successfully. Please log in.',
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: validRole.name
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email }).populate('role');

        const accessToken = generateAccessToken(user);

        res.cookie('accessToken', accessToken, cookieConfig);

        res.json({
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role.name
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getCurrentUser = async (req, res) => {
    const userId = req.user.userId;

    try {
        const user = await User.findById(userId).populate('role').select('-password');

        res.json({
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role.name,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateUserProfile = async (req, res) => {
    const { firstName, lastName, email, password, newPassword, role } = req.body;

    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if ((email || newPassword) && !await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;
        if (role) user.role = role;
        if (newPassword) { user.password = await bcrypt.hash(newPassword, 10); }

        await user.save();
        await user.populate('role');

        // Generate new token if email changed
        if (email) {
            const accessToken = generateAccessToken(user);
            res.cookie('accessToken', accessToken, cookieConfig);
        }

        res.json({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role.name,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const logoutUser = (req, res) => {
    res.clearCookie('accessToken', {
        ...cookieConfig,
        maxAge: 0
    });

    res.json({ message: 'Logout successful' });
};

module.exports = { registerUser, loginUser, getCurrentUser, updateUserProfile, logoutUser };