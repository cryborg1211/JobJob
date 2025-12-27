const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { auth } = require('../middleware/auth');

// Validation helpers
const isValidString = (str, minLen = 1, maxLen = 1000) =>
    typeof str === 'string' && str.trim().length >= minLen && str.trim().length <= maxLen;

const isValidUrl = (url) => {
    if (!url) return true; // Optional
    try {
        const parsed = new URL(url);
        // Only allow http and https protocols
        return ['http:', 'https:'].includes(parsed.protocol);
    } catch {
        return false;
    }
};

const isValidPlan = (plan) => ['free', 'eco', 'plus', 'max', 'gold'].includes(plan);

const sanitize = (str) => str?.trim() || '';

// @route   GET api/users/candidates/all
// @desc    Get all candidates (for employers to browse)
// @access  Private
router.get('/candidates/all', auth, async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
        const skip = (page - 1) * limit;

        const { skills } = req.query;

        const where = { role: 'candidate' };

        if (skills) {
            const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
            if (skillsArray.length > 0) {
                where.skills = { hasSome: skillsArray };
            }
        }

        const [candidates, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    username: true,
                    skills: true,
                    experience: true,
                    createdAt: true
                },
                skip,
                take: limit
            }),
            prisma.user.count({ where })
        ]);

        res.json({
            candidates,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                subscriptionPlan: true,
                subscriptionExpiresAt: true,
                skills: true,
                experience: true,
                cvUrl: true,
                companyName: true,
                companyWebsite: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   PUT api/users/me
// @desc    Update current user profile
// @access  Private
router.put('/me', auth, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const { username, skills, experience, cvUrl, companyName, companyWebsite } = req.body;

        const updateData = {};

        // Validate and update username
        if (username !== undefined) {
            if (!isValidString(username, 3, 30)) {
                return res.status(400).json({ msg: 'Username must be 3-30 characters' });
            }
            const normalizedUsername = username.toLowerCase().trim();

            // Check if username is taken by another user
            const existingUser = await prisma.user.findFirst({
                where: {
                    username: normalizedUsername,
                    id: { not: req.user.id }
                }
            });

            if (existingUser) {
                return res.status(400).json({ msg: 'Username already taken' });
            }

            updateData.username = normalizedUsername;
        }

        // Candidate profile fields
        if (user.role === 'candidate') {
            if (skills !== undefined) {
                if (Array.isArray(skills)) {
                    updateData.skills = skills
                        .filter(s => typeof s === 'string' && s.trim().length > 0)
                        .map(s => s.trim())
                        .slice(0, 30); // Max 30 skills
                }
            }
            if (experience !== undefined) {
                if (experience && !isValidString(experience, 0, 2000)) {
                    return res.status(400).json({ msg: 'Experience must be max 2000 characters' });
                }
                updateData.experience = sanitize(experience) || null;
            }
            if (cvUrl !== undefined) {
                if (cvUrl && !isValidUrl(cvUrl)) {
                    return res.status(400).json({ msg: 'Invalid CV URL' });
                }
                updateData.cvUrl = cvUrl || null;
            }
        }

        // Employer profile fields
        if (user.role === 'employer') {
            if (companyName !== undefined) {
                if (companyName && !isValidString(companyName, 2, 100)) {
                    return res.status(400).json({ msg: 'Company name must be 2-100 characters' });
                }
                updateData.companyName = sanitize(companyName) || null;
            }
            if (companyWebsite !== undefined) {
                if (companyWebsite && !isValidUrl(companyWebsite)) {
                    return res.status(400).json({ msg: 'Invalid company website URL' });
                }
                updateData.companyWebsite = companyWebsite || null;
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: req.user.id },
            data: updateData,
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                subscriptionPlan: true,
                subscriptionExpiresAt: true,
                skills: true,
                experience: true,
                cvUrl: true,
                companyName: true,
                companyWebsite: true,
                createdAt: true,
                updatedAt: true
            }
        });

        res.json(updatedUser);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   PUT api/users/me/subscription
// @desc    Update user subscription
// @access  Private
router.put('/me/subscription', auth, async (req, res) => {
    try {
        const { plan, expiresAt } = req.body;

        if (!plan) {
            return res.status(400).json({ msg: 'Plan is required' });
        }

        if (!isValidPlan(plan)) {
            return res.status(400).json({ msg: 'Invalid subscription plan' });
        }

        const updateData = {
            subscriptionPlan: plan
        };

        if (expiresAt) {
            const expDate = new Date(expiresAt);
            if (isNaN(expDate.getTime())) {
                return res.status(400).json({ msg: 'Invalid expiration date' });
            }
            updateData.subscriptionExpiresAt = expDate;
        }

        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: updateData,
            select: {
                id: true,
                username: true,
                email: true,
                role: true,
                subscriptionPlan: true,
                subscriptionExpiresAt: true,
                createdAt: true,
                updatedAt: true
            }
        });

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET api/users/:id
// @desc    Get public user/company info
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
            select: {
                id: true,
                username: true,
                role: true,
                skills: true,
                experience: true,
                companyName: true,
                companyWebsite: true,
                createdAt: true
            }
        });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
