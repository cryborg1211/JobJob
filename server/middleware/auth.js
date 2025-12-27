const jwt = require('jsonwebtoken');

const getJwtSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret === 'your_jwt_secret') {
        if (process.env.NODE_ENV === 'production') {
            console.error('FATAL: JWT_SECRET must be set in production!');
            process.exit(1);
        }
        console.warn('WARNING: Using default JWT secret. Set JWT_SECRET in production!');
        // Use a unique-per-restart secret in dev to prevent token reuse across restarts
        return 'dev_jwt_secret_' + process.pid;
    }
    return secret;
};

// Middleware to verify JWT token
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, getJwtSecret());
        req.user = decoded.user;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Token expired, please login again' });
        }
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Middleware to check if user is an employer
const isEmployer = (req, res, next) => {
    if (req.user.role !== 'employer') {
        return res.status(403).json({ msg: 'Access denied. Employer role required.' });
    }
    next();
};

// Middleware to check if user is a candidate
const isCandidate = (req, res, next) => {
    if (req.user.role !== 'candidate') {
        return res.status(403).json({ msg: 'Access denied. Candidate role required.' });
    }
    next();
};

module.exports = { auth, isEmployer, isCandidate, getJwtSecret };
