const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_REFRESH_SECRET } = require('../config/dotenv');

const authenticateToken = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Access token expired' });
            } else {
                return res.status(403).json({ message: 'Invalid token' });
            }
        }

        req.user = user;
        next();
    });
};

const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        next();
    };
};

const refreshAccessToken = (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token required' });
    }

    jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const newAccessToken = jwt.sign(
            { userId: user.userId, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ accessToken: newAccessToken });
    });
};

const requireAuth = (req, res, next) => {
    authenticateToken(req, res, next);
};

const requireAuthAndRole = (requiredRole) => {
    return async (req, res, next) => {
        await authenticateToken(req, res, async (err) => {
            if (err) return next(err);
            const requestingUser = await User.findById(req.user.userId).populate('role');
            if (!requestingUser) return res.status(404).json({ message: 'User not found' });

            if (requestingUser.role.name !== requiredRole) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            next();
        });
    };
};

const requireOwnershipOrAdmin = (Model) => {
    return async (req, res, next) => {
        const resourceId = req.params.id;
        const userId = req.user.userId;
        const userRole = req.user.role;

        try {
            const resource = await Model.findById(resourceId);
            if (!resource) {
                return res.status(404).json({ message: 'Resource not found' });
            }

            if (resource.user.toString() !== userId && userRole.name !== 'admin') {
                return res.status(403).json({ message: 'You are not authorized to perform this action' });
            }

            next();
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    };
};

const conditionalRequireAuth = (req, res, next) => {
    const { action } = req.body;

    if (action === 'enable' || action === 'disable') {
        return requireAuth(req, res, next);
    }

    next();
};

module.exports = { authenticateToken, authorizeRole, requireAuth, requireAuthAndRole, refreshAccessToken, requireOwnershipOrAdmin, conditionalRequireAuth };