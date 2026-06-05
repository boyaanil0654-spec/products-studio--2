models/Contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [200, 'Name cannot exceed 200 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    company: {
        type: String,
        trim: true,
        default: ''
    },
    message: {
        type: String,
        trim: true,
        default: ''
    },
    type: {
        type: String,
        enum: ['contact', 'demo', 'signup'],
        default: 'contact'
    },
    status: {
        type: String,
        enum: ['new', 'read', 'replied', 'archived'],
        default: 'new'
    },
    ipAddress: String,
    userAgent: String
}, {
    timestamps: true
});

contactSchema.index({ email: 1, createdAt: -1 });
contactSchema.index({ status: 1 });

module.exports = mongoose.model('Contact', contactSchema);
