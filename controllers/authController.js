controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'anox-secret-key-change-in-production', {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
};

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, company } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'An account with this email already exists' });
        }
        const user = await User.create({ name, email, password, company });
        const token = generateToken(user._id);
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });
        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            token,
            user: user.toJSON()
        });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        if (!user.isActive) {
            return res.status(403).json({ success: false, message: 'Account is deactivated. Contact support.' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        const token = generateToken(user._id);
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });
        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: user.toJSON()
        });
    } catch (err) {
        next(err);
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.json({ success: true, user });
    } catch (err) {
        next(err);
    }
};
