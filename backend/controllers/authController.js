const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(String(email).toLowerCase());
};

const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

const generateAccessToken = (user) => {
    return jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

const registerUser = async (req, res) => {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (!validatePassword(password)) {
        return res.status(400).json({ message: 'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character' });
    }

    if (!validateEmail(email)) {
        return res.status(400).json({ message: 'Email format is not correct' });
    }

    try {
        if (!process.env.JWT_SECRET || !process.env.JWT_REFRESH_SECRET) {
            throw new Error('JWT secret keys are not set');
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) return res.status(400).json({ message: 'Email already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ firstName, lastName, email, password: hashedPassword, role });
        await user.save();

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.status(201).json({ message: 'User registered successfully', accessToken, refreshToken });
    } catch (error) {
        console.error('Server error during registration:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.json({
            accessToken,
            refreshToken,
            userId: user._id,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        });
    } catch (error) {
        console.error('Server error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh Token is required' });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const accessToken = generateAccessToken({ _id: user._id, role: user.role });

        res.json({ accessToken, role: user.role });
    } catch (error) {
        res.status(403).json({ message: 'Invalid Refresh Token' });
    }
};

const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            address: user.address || {},
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const updateUserProfile = async (req, res) => {
    const { firstName, lastName, email, password, newPassword } = req.body;

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
        if (newPassword) user.password = await bcrypt.hash(newPassword, 10);

        await user.save();

        res.json({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const logoutUser = (req, res) => {
    res.json({ message: 'Logout successful' });
};

module.exports = { registerUser, loginUser, getCurrentUser, updateUserProfile, refreshAccessToken, logoutUser };