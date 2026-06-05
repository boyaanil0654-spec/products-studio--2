const Contact = require('../models/Contact');
const Signup = require('../models/Signup');

exports.submitContact = async (req, res, next) => {
    try {
        const { name, email, company, message, type } = req.body;
        if (!name || !email) {
            return res.status(400).json({ success: false, message: 'Name and email are required' });
        }
        const contact = await Contact.create({
            name,
            email,
            company: company || '',
            message: message || '',
            type: type || 'contact',
            ipAddress: req.ip,
            userAgent: req.get('user-agent') || ''
        });
        res.status(201).json({
            success: true,
            message: 'Thank you! Your message has been received. We\'ll get back to you shortly.',
            id: contact._id
        });
    } catch (err) {
        next(err);
    }
};

exports.signup = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: 'Email is required' });
        }
        const existing = await Signup.findOne({ email });
        if (existing) {
            return res.status(200).json({ success: true, message: 'You\'re already on the list! We\'ll keep you updated.' });
        }
        await Signup.create({
            email,
            source: 'website_cta',
            ipAddress: req.ip,
            userAgent: req.get('user-agent') || ''
        });
        res.status(201).json({ success: true, message: 'Welcome to ANOX! Check your inbox for next steps.' });
    } catch (err) {
        next(err);
    }
};

exports.getContacts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const contacts = await Contact.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        const total = await Contact.countDocuments();
        res.json({ success: true, contacts, total, page, pages: Math.ceil(total / limit) });
    } catch (err) {
        next(err);
    }
};
