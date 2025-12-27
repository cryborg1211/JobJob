const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { auth } = require('../middleware/auth');

// @route   POST api/interactions/swipe
// @desc    Record a like or pass interaction
// @access  Private
router.post('/swipe', auth, async (req, res) => {
    try {
        const { targetId, type, targetType } = req.body;

        if (!['like', 'pass'].includes(type)) {
            return res.status(400).json({ msg: 'Invalid interaction type' });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Determine if target is a job or user based on user role or explicit targetType
        const isTargetJob = targetType === 'job' || user.role === 'candidate';

        // Check if already interacted
        const existingInteraction = await prisma.interaction.findFirst({
            where: {
                userId: req.user.id,
                ...(isTargetJob ? { targetJobId: targetId } : { targetUserId: targetId })
            }
        });

        if (existingInteraction) {
            return res.status(400).json({ msg: 'Already interacted with this target' });
        }

        // Create interaction
        const interaction = await prisma.interaction.create({
            data: {
                userId: req.user.id,
                type,
                ...(isTargetJob ? { targetJobId: targetId } : { targetUserId: targetId })
            }
        });

        // Check for mutual match
        let isMatch = false;

        if (type === 'like') {
            if (user.role === 'candidate' && isTargetJob) {
                // Candidate liked a job - check if employer liked this candidate
                const job = await prisma.job.findUnique({
                    where: { id: targetId }
                });

                if (job) {
                    const employerLikedCandidate = await prisma.interaction.findFirst({
                        where: {
                            userId: job.employerId,
                            targetUserId: req.user.id,
                            type: 'like'
                        }
                    });
                    isMatch = !!employerLikedCandidate;
                }
            } else if (user.role === 'employer' && !isTargetJob) {
                // Employer liked a candidate - check if candidate liked any of employer's jobs
                const employerJobs = await prisma.job.findMany({
                    where: { employerId: req.user.id },
                    select: { id: true }
                });

                const jobIds = employerJobs.map(j => j.id);

                const candidateLikedJob = await prisma.interaction.findFirst({
                    where: {
                        userId: targetId,
                        targetJobId: { in: jobIds },
                        type: 'like'
                    }
                });
                isMatch = !!candidateLikedJob;
            }
        }

        res.json({
            msg: 'Interaction recorded',
            isMatch,
            interaction: {
                id: interaction.id,
                type: interaction.type,
                createdAt: interaction.createdAt
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET api/interactions/matches
// @desc    Get all mutual matches
// @access  Private
router.get('/matches', auth, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const matches = [];

        if (user.role === 'candidate') {
            // Get jobs the candidate liked
            const likedJobs = await prisma.interaction.findMany({
                where: {
                    userId: req.user.id,
                    type: 'like',
                    targetJobId: { not: null }
                },
                include: {
                    targetJob: {
                        include: {
                            employer: {
                                select: {
                                    id: true,
                                    username: true,
                                    companyName: true,
                                    companyWebsite: true
                                }
                            }
                        }
                    }
                }
            });

            // Check which employers liked this candidate back
            for (const interaction of likedJobs) {
                if (!interaction.targetJob) continue;

                const employerLikedBack = await prisma.interaction.findFirst({
                    where: {
                        userId: interaction.targetJob.employerId,
                        targetUserId: req.user.id,
                        type: 'like'
                    }
                });

                if (employerLikedBack) {
                    matches.push({
                        job: {
                            id: interaction.targetJob.id,
                            title: interaction.targetJob.title,
                            description: interaction.targetJob.description,
                            salary: interaction.targetJob.salary,
                            location: interaction.targetJob.location
                        },
                        employer: interaction.targetJob.employer,
                        matchedAt: employerLikedBack.createdAt
                    });
                }
            }
        } else {
            // Employer - get candidates they liked
            const likedCandidates = await prisma.interaction.findMany({
                where: {
                    userId: req.user.id,
                    type: 'like',
                    targetUserId: { not: null }
                },
                include: {
                    targetUser: {
                        select: {
                            id: true,
                            username: true,
                            skills: true,
                            experience: true
                        }
                    }
                }
            });

            // Get employer's jobs
            const employerJobs = await prisma.job.findMany({
                where: { employerId: req.user.id },
                select: { id: true, title: true }
            });
            const jobIds = employerJobs.map(j => j.id);

            // Check which candidates liked employer's jobs
            for (const interaction of likedCandidates) {
                if (!interaction.targetUser) continue;

                const candidateLikedJob = await prisma.interaction.findFirst({
                    where: {
                        userId: interaction.targetUserId,
                        targetJobId: { in: jobIds },
                        type: 'like'
                    }
                });

                if (candidateLikedJob) {
                    const matchedJob = employerJobs.find(j => j.id === candidateLikedJob.targetJobId);

                    matches.push({
                        candidate: interaction.targetUser,
                        job: matchedJob || null,
                        matchedAt: candidateLikedJob.createdAt
                    });
                }
            }
        }

        res.json(matches);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET api/interactions/history
// @desc    Get user's interaction history
// @access  Private
router.get('/history', auth, async (req, res) => {
    try {
        const { page = 1, limit = 20, type } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        const where = { userId: req.user.id };
        if (type && ['like', 'pass'].includes(type)) {
            where.type = type;
        }

        const [interactions, total] = await Promise.all([
            prisma.interaction.findMany({
                where,
                include: {
                    targetJob: user.role === 'candidate' ? {
                        include: {
                            employer: {
                                select: {
                                    id: true,
                                    username: true,
                                    companyName: true
                                }
                            }
                        }
                    } : false,
                    targetUser: user.role === 'employer' ? {
                        select: {
                            id: true,
                            username: true,
                            skills: true,
                            experience: true
                        }
                    } : false
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: Number(limit)
            }),
            prisma.interaction.count({ where })
        ]);

        const formattedInteractions = interactions.map(i => ({
            id: i.id,
            type: i.type,
            createdAt: i.createdAt,
            target: user.role === 'candidate'
                ? { type: 'job', data: i.targetJob }
                : { type: 'candidate', data: i.targetUser }
        }));

        res.json({
            interactions: formattedInteractions,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            total
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
