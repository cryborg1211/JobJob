const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { auth } = require('../middleware/auth');

// @route   GET api/users/candidates/all
// @desc    Get all candidates (for employers to browse)
// @access  Private
router.get('/candidates/all', auth, async (req, res) => {
    try {
        const { page = 1, limit = 10, skills } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const where = { role: 'candidate' };

        if (skills) {
            const skillsArray = skills.split(',').map(s => s.trim());
            where.skills = { hasSome: skillsArray };
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
                take: Number(limit)
            }),
            prisma.user.count({ where })
        ]);

        res.json({
            candidates,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
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
        if (username) updateData.username = username;

        // Candidate profile fields
        if (user.role === 'candidate') {
            if (skills) updateData.skills = skills;
            if (experience !== undefined) updateData.experience = experience;
            if (cvUrl !== undefined) updateData.cvUrl = cvUrl;
        }

        // Employer profile fields
        if (user.role === 'employer') {
            if (companyName !== undefined) updateData.companyName = companyName;
            if (companyWebsite !== undefined) updateData.companyWebsite = companyWebsite;
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

        const updateData = {
            subscriptionPlan: plan
        };

        if (expiresAt) {
            updateData.subscriptionExpiresAt = new Date(expiresAt);
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
