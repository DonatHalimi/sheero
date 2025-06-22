const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, JWT_REFRESH_SECRET } = require('../config/core/dotenv');
const { accessCookieConfig, refreshCookieConfig } = require('../config/auth/cookie');
const { generateRefreshToken, generateAccessToken } = require('../config/core/utils');

const authenticateToken = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json({ message: 'Authentication required' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Access token expired' });
            } else {
                return res.status(403).json({ message: 'Invalid token' });
            }
        }

        req.user = decoded;
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

const revokedRefreshTokens = new Set();

const addToRevokedTokens = (oldRefreshToken) => {
    revokedRefreshTokens.add(oldRefreshToken);

    if (revokedRefreshTokens.size > 10000) {
        const tokensArray = Array.from(revokedRefreshTokens);
        revokedRefreshTokens.clear();
        tokensArray.slice(-5000).forEach(token => revokedRefreshTokens.add(token));
    }
};

const isTokenRevoked = (refreshToken) => {
    return revokedRefreshTokens.has(refreshToken);
};

const requireAuth = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    if (!accessToken) {
        if (!refreshToken) return res.status(401).json({ message: 'Authentication required' });

        return await handleTokenRefresh(req, res, next, refreshToken);
    }

    jwt.verify(accessToken, JWT_SECRET, async (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                if (!refreshToken) return res.status(401).json({ message: 'Access token expired and no refresh token' });

                return await handleTokenRefresh(req, res, next, refreshToken);
            } else {
                return res.status(403).json({ message: 'Invalid access token' });
            }
        }

        req.user = decoded;
        next();
    });
};

const requireAuthAndRole = (requiredRoles) => {
    return async (req, res, next) => {
        await new Promise((resolve, reject) => {
            requireAuth(req, res, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        try {
            const requestingUser = await User.findById(req.user.userId).populate('role');
            if (!requestingUser) return res.status(404).json({ message: 'User not found' });

            const allowedRoles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
            if (!allowedRoles.includes(requestingUser.role.name)) return res.status(403).json({ message: 'Forbidden' });

            next();
        } catch (error) {
            return res.status(500).json({ success: false, message: 'Error checking user role' });
        }
    };
};

const handleTokenRefresh = async (req, res, next, refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

        if (isTokenRevoked(refreshToken)) return res.status(403).json({ message: 'Refresh token has been revoked' });

        const user = await User.findById(decoded.userId).populate('role');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const newAccessToken = generateAccessToken(user._id);
        const newRefreshToken = generateRefreshToken(user._id);

        addToRevokedTokens(refreshToken);

        res.cookie('accessToken', newAccessToken, accessCookieConfig);
        res.cookie('refreshToken', newRefreshToken, refreshCookieConfig);

        req.user = {
            userId: user._id,
            role: user.role.name
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Refresh token expired, please login again', error: error.message });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Invalid refresh token', error: error.message });
        } else {
            return res.status(500).json({ message: 'Error refreshing token', error: error.message });
        }
    }
};

const requireOwnershipOrAdmin = (Model) => {
    return async (req, res, next) => {
        const resourceId = req.params.id;
        const userId = req.user.userId;
        const userRole = req.user.role;

        try {
            const resource = await Model.findById(resourceId);
            if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });

            if (resource.user.toString() !== userId && userRole.name !== 'admin') {
                return res.status(403).json({ success: false, message: 'You are not authorized to perform this action' });
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

module.exports = { authenticateToken, authorizeRole, requireAuth, requireAuthAndRole, requireOwnershipOrAdmin, addToRevokedTokens, conditionalRequireAuth };