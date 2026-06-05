middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized. Please log in.' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'anox-secret-key-change-in-production');
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'User not found. Please log in again.' });
        }
        next();
    } catch (err) {
        next(err);
    }
};

const optionalAuth = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'anox-secret-key-change-in-production');
            req.user = await User.findById(decoded.id).select('-password');
        }
    } catch (err) {
        // Optional auth - continue without user
    }
    next();
};

module.exports = { protect, optionalAuth };
