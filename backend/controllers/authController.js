const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');

const validateName = (name) => {
    const nameRegex = /^[A-Z][a-z]{1,9}$/;
    return nameRegex.test(name);
};

const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(String(email).toLowerCase());
};

const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

const generateAccessToken = (user) => {
    return jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const registerUser = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (!validateName(firstName) || !validateName(lastName)) {
        return res.status(400).json({ message: 'Name must start with a capital letter and contain 2-10 alphabetic characters' });
    }

    if (!validatePassword(password)) {
        return res.status(400).json({ message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character' });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    try {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) return res.status(400).json({ message: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const validRole = await Role.findById(role) || await Role.findOne({ name: 'user' });
        const user = new User({ firstName, lastName, email, password: hashedPassword, role: validRole._id });
        await user.save();

        const accessToken = generateAccessToken(user);

        res.status(201).json({ message: 'User registered successfully', accessToken });
    } catch (error) {
        console.error('Server error during registration:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).populate('role');

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user);

        res.json({
            accessToken,
            role: user.role.name,
        });
    } catch (error) {
        console.error('Server error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate('role').select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
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
            console.log('Incorrect current password');
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;
        if (role) user.role = role;
        if (newPassword) { user.password = await bcrypt.hash(newPassword, 10); }

        await user.save();

        await user.populate('role');

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
    res.json({ message: 'Logout successful' });
};

module.exports = { registerUser, loginUser, getCurrentUser, updateUserProfile, logoutUser };