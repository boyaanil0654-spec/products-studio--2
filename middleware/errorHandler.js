const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    console.error('Stack:', process.env.NODE_ENV === 'development' ? err.stack : 'hidden');

    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    if (err.code === 11000) {
        return res.status(409).json({ success: false, message: 'Duplicate entry. This record already exists.' });
    }
    if (err.name === 'CastError') {
        return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ success: false, message: 'Invalid token. Please log in again.' });
    }
    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ success: false, message: 'Token expired. Please log in again.' });
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    res.status(statusCode).json({ success: false, message });
};

module.exports = { errorHandler };
