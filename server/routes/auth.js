const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const { getJwtSecret } = require('../middleware/auth');

// Validation helpers
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword = (password) => password && password.length >= 6;
const isValidUsername = (username) => username && username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    // Validation
    if (!username || !email || !password) {
        return res.status(400).json({ msg: 'Please provide username, email, and password' });
    }

    if (!isValidUsername(username)) {
        return res.status(400).json({ msg: 'Username must be at least 3 characters and contain only letters, numbers, and underscores' });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ msg: 'Please provide a valid email address' });
    }

    if (!isValidPassword(password)) {
        return res.status(400).json({ msg: 'Password must be at least 6 characters' });
    }

    if (role && !['candidate', 'employer'].includes(role)) {
        return res.status(400).json({ msg: 'Role must be candidate or employer' });
    }

    try {
        // Check if user exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: email.toLowerCase() },
                    { username: username.toLowerCase() }
                ]
            }
        });

        if (existingUser) {
            if (existingUser.email === email.toLowerCase()) {
                return res.status(400).json({ msg: 'Email already registered' });
            }
            return res.status(400).json({ msg: 'Username already taken' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await prisma.user.create({
            data: {
                username: username.toLowerCase(),
                email: email.toLowerCase(),
                password: hashedPassword,
                role: role || 'candidate'
            }
        });

        // Create JWT payload
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        const token = jwt.sign(payload, getJwtSecret(), { expiresIn: '24h' });

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { username, email, password, identifier } = req.body;
    const loginId = (identifier || username || email || '').toLowerCase().trim();

    if (!loginId || !password) {
        return res.status(400).json({ msg: 'Please provide username/email and password' });
    }

    try {
        // Find user by username or email
        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: loginId },
                    { email: loginId }
                ]
            }
        });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Create JWT payload
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        const token = jwt.sign(payload, getJwtSecret(), { expiresIn: '24h' });

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
