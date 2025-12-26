const jwt = require('jsonwebtoken');

// DEMO MODE - Authentication disabled for demo purposes
const DEMO_MODE = true;

// Demo users for testing - use x-demo-role header to switch
// These IDs match the test users created in the database
const DEMO_USERS = {
    employer: {
        id: 'cmjlttv7s0000y3ut5r3brgju',
        role: 'employer'
    },
    candidate: {
        id: 'cmjltyql90001y3utocsnomou',
        role: 'candidate'
    }
};

// Middleware to verify JWT token
const auth = (req, res, next) => {
    // DEMO: Skip authentication, use x-demo-role header to switch roles
    if (DEMO_MODE) {
        const demoRole = req.header('x-demo-role') || 'employer';
        req.user = DEMO_USERS[demoRole] || DEMO_USERS.employer;
        return next();
    }

    // Get token from header
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// Middleware to check if user is an employer
const isEmployer = (req, res, next) => {
    // DEMO: Skip role check
    if (DEMO_MODE) {
        return next();
    }

    if (req.user.role !== 'employer') {
        return res.status(403).json({ msg: 'Access denied. Employer role required.' });
    }
    next();
};

// Middleware to check if user is a candidate
const isCandidate = (req, res, next) => {
    // DEMO: Skip role check
    if (DEMO_MODE) {
        return next();
    }

    if (req.user.role !== 'candidate') {
        return res.status(403).json({ msg: 'Access denied. Candidate role required.' });
    }
    next();
};

module.exports = { auth, isEmployer, isCandidate };
