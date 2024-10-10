const jwt = require('jsonwebtoken');
const Review = require('../models/Review');
const Address = require('../models/Address');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const Role = require('../models/Role');
const User = require('../models/User');

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

// TRY LATER: TO MAKE SURE USER EDITS THEIR OWN REVIEW/ADDRESS/CART/WISHLIST

// const checkReviewOwnership = async (req, res, next) => {
//     try {
//         const reviewId = req.params.id;
//         const userId = req.user.userId;
//         const userRole = req.user.role;

//         const review = await Review.findById(reviewId);

//         if (!review) {
//             return res.status(404).json({ message: 'Review not found' });
//         }

//         if (review.user.toString() !== userId && userRole !== 'admin') {
//             return res.status(403).json({ message: 'You are not authorized to modify this review' });
//         }

//         // If the user is the owner or an admin, allow the operation
//         next();
//     } catch (error) {
//         console.error('Error checking review ownership:', error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// const checkAddressOwnership = async (req, res, next) => {
//     try {
//         const addressId = req.params.id;
//         const userId = req.user.userId;
//         const userRole = req.user.role;

//         const address = await Address.findById(addressId);

//         if (!address) {
//             return res.status(404).json({ message: 'Address not found' });
//         }

//         if (address.user.toString() !== userId && userRole !== 'admin') {
//             return res.status(403).json({ message: 'You are not authorized to modify this address' });
//         }

//         // If the user is the owner or an admin, allow the operation
//         next();
//     } catch (error) {
//         console.error('Error checking address ownership:', error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// const checkCartOwnership = async (req, res, next) => {
//     try {
//         const cartId = req.params.id;
//         const userId = req.user.userId;
//         const userRole = req.user.role;

//         const cart = await Cart.findById(cartId);

//         if (!cart) {
//             return res.status(404).json({ message: 'Cart not found' });
//         }

//         if (cart.user.toString() !== userId && userRole !== 'admin') {
//             return res.status(403).json({ message: 'You are not authorized to modify this cart' });
//         }

//         // If the user is the owner or an admin, allow the operation
//         next();
//     } catch (error) {
//         console.error('Error checking cart ownership:', error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

// const checkWishlistOwnership = async (req, res, next) => {
//     try {
//         const wishlistId = req.params.id;
//         const userId = req.user.userId;
//         const userRole = req.user.role;

//         const wishlist = await Wishlist.findById(wishlistId);

//         if (!wishlist) {
//             return res.status(404).json({ message: 'Wishlist not found' });
//         }

//         if (wishlist.user.toString() !== userId && userRole !== 'admin') {
//             return res.status(403).json({ message: 'You are not authorized to modify this wishlist' });
//         }

//         // If the user is the owner or an admin, allow the operation
//         next();
//     } catch (error) {
//         console.error('Error checking wishlist ownership:', error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };

module.exports = { authenticateToken, authorizeRole, protect, requireAuthAndRole, refreshAccessToken };