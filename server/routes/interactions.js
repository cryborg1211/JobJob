const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { auth } = require('../middleware/auth');

// Validation helpers
const isValidCuid = (id) => typeof id === 'string' && id.length > 0 && id.length <= 30;

// @route   POST api/interactions/swipe
// @desc    Record a like or pass interaction
// @access  Private
router.post('/swipe', auth, async (req, res) => {
    try {
        const { targetId, type, targetType } = req.body;

        // Validate input
        if (!targetId || !isValidCuid(targetId)) {
            return res.status(400).json({ msg: 'Invalid target ID' });
        }

        if (!['like', 'pass'].includes(type)) {
            return res.status(400).json({ msg: 'Invalid interaction type' });
        }

        if (targetType && !['job', 'user'].includes(targetType)) {
            return res.status(400).json({ msg: 'Invalid target type' });
        }

        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Determine target type based on user role
        const isTargetJob = targetType === 'job' || user.role === 'candidate';

        // Validate target exists and is appropriate for user role
        if (isTargetJob) {
            // Candidate swiping on jobs
            if (user.role !== 'candidate') {
                return res.status(400).json({ msg: 'Only candidates can swipe on jobs' });
            }

            const job = await prisma.job.findUnique({
                where: { id: targetId }
            });

            if (!job) {
                return res.status(404).json({ msg: 'Job not found' });
            }

            if (job.status !== 'active') {
                return res.status(400).json({ msg: 'Cannot interact with inactive job' });
            }
        } else {
            // Employer swiping on candidates
            if (user.role !== 'employer') {
                return res.status(400).json({ msg: 'Only employers can swipe on candidates' });
            }

            const targetUser = await prisma.user.findUnique({
                where: { id: targetId }
            });

            if (!targetUser) {
                return res.status(404).json({ msg: 'Candidate not found' });
            }

            if (targetUser.role !== 'candidate') {
                return res.status(400).json({ msg: 'Can only swipe on candidates' });
            }

            // Prevent self-swipe
            if (targetId === req.user.id) {
                return res.status(400).json({ msg: 'Cannot swipe on yourself' });
            }
        }

        // Check if already interacted - use upsert pattern to avoid race condition
        const existingInteraction = await prisma.interaction.findFirst({
            where: {
                userId: req.user.id,
                ...(isTargetJob ? { targetJobId: targetId } : { targetUserId: targetId })
            }
        });

        if (existingInteraction) {
            return res.status(400).json({ msg: 'Already interacted with this target' });
        }

        // Create interaction with error handling for race condition
        let interaction;
        try {
            interaction = await prisma.interaction.create({
                data: {
                    userId: req.user.id,
                    type,
                    ...(isTargetJob ? { targetJobId: targetId } : { targetUserId: targetId })
                }
            });
        } catch (err) {
            // Handle unique constraint violation (race condition)
            if (err.code === 'P2002') {
                return res.status(400).json({ msg: 'Already interacted with this target' });
            }
            throw err;
        }

        // Check for mutual match
        let isMatch = false;

        if (type === 'like') {
            if (user.role === 'candidate' && isTargetJob) {
                // Candidate liked a job - check if employer liked this candidate
                const job = await prisma.job.findUnique({
                    where: { id: targetId },
                    select: { employerId: true }
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
                const candidateLikedJob = await prisma.interaction.findFirst({
                    where: {
                        userId: targetId,
                        type: 'like',
                        targetJob: {
                            employerId: req.user.id
                        }
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
        console.error('Swipe error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET api/interactions/matches
// @desc    Get all mutual matches with pagination
// @access  Private
router.get('/matches', auth, async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
        const skip = (page - 1) * limit;

        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        let matches = [];
        let total = 0;

        if (user.role === 'candidate') {
            // Optimized query: Get jobs liked by candidate where employer also liked the candidate
            const likedJobsWithMutualLike = await prisma.interaction.findMany({
                where: {
                    userId: req.user.id,
                    type: 'like',
                    targetJobId: { not: null },
                    targetJob: {
                        employer: {
                            interactionsSent: {
                                some: {
                                    targetUserId: req.user.id,
                                    type: 'like'
                                }
                            }
                        }
                    }
                },
                include: {
                    targetJob: {
                        select: {
                            id: true,
                            title: true,
                            description: true,
                            salary: true,
                            location: true,
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
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            });

            // Get total count for pagination
            total = await prisma.interaction.count({
                where: {
                    userId: req.user.id,
                    type: 'like',
                    targetJobId: { not: null },
                    targetJob: {
                        employer: {
                            interactionsSent: {
                                some: {
                                    targetUserId: req.user.id,
                                    type: 'like'
                                }
                            }
                        }
                    }
                }
            });

            matches = likedJobsWithMutualLike.map(interaction => ({
                job: interaction.targetJob,
                employer: interaction.targetJob?.employer,
                matchedAt: interaction.createdAt
            }));
        } else {
            // Employer: Get candidates they liked who also liked their jobs
            const employerJobs = await prisma.job.findMany({
                where: { employerId: req.user.id },
                select: { id: true, title: true }
            });
            const jobIds = employerJobs.map(j => j.id);

            if (jobIds.length === 0) {
                return res.json({
                    matches: [],
                    totalPages: 0,
                    currentPage: page,
                    total: 0
                });
            }

            // Find candidates the employer liked who also liked one of their jobs
            const likedCandidatesWithMutualLike = await prisma.interaction.findMany({
                where: {
                    userId: req.user.id,
                    type: 'like',
                    targetUserId: { not: null },
                    targetUser: {
                        interactionsSent: {
                            some: {
                                type: 'like',
                                targetJobId: { in: jobIds }
                            }
                        }
                    }
                },
                include: {
                    targetUser: {
                        select: {
                            id: true,
                            username: true,
                            skills: true,
                            experience: true,
                            interactionsSent: {
                                where: {
                                    type: 'like',
                                    targetJobId: { in: jobIds }
                                },
                                select: {
                                    targetJobId: true,
                                    createdAt: true
                                },
                                take: 1
                            }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            });

            total = await prisma.interaction.count({
                where: {
                    userId: req.user.id,
                    type: 'like',
                    targetUserId: { not: null },
                    targetUser: {
                        interactionsSent: {
                            some: {
                                type: 'like',
                                targetJobId: { in: jobIds }
                            }
                        }
                    }
                }
            });

            matches = likedCandidatesWithMutualLike.map(interaction => {
                const candidateJobLike = interaction.targetUser?.interactionsSent?.[0];
                const matchedJob = candidateJobLike
                    ? employerJobs.find(j => j.id === candidateJobLike.targetJobId)
                    : null;

                return {
                    candidate: {
                        id: interaction.targetUser?.id,
                        username: interaction.targetUser?.username,
                        skills: interaction.targetUser?.skills,
                        experience: interaction.targetUser?.experience
                    },
                    job: matchedJob,
                    matchedAt: candidateJobLike?.createdAt || interaction.createdAt
                };
            });
        }

        res.json({
            matches,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (err) {
        console.error('Matches error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET api/interactions/history
// @desc    Get user's interaction history
// @access  Private
router.get('/history', auth, async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
        const skip = (page - 1) * limit;
        const { type } = req.query;

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
                        select: {
                            id: true,
                            title: true,
                            location: true,
                            salary: true,
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
                take: limit
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
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            total
        });
    } catch (err) {
        console.error('History error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
