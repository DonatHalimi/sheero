const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
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

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        const newAccessToken = jwt.sign(
            { userId: user.userId, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ accessToken: newAccessToken });
    });
};

const protect = (req, res, next) => {
    authenticateToken(req, res, next);
};

const requireAuthAndRole = (role) => {
    return (req, res, next) => {
        authenticateToken(req, res, (err) => {
            if (err) return next(err);
            if (req.user.role !== role) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            next();
        });
    };
};

module.exports = { authenticateToken, authorizeRole, protect, requireAuthAndRole, refreshAccessToken };