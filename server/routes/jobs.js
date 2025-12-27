const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { auth, isEmployer } = require('../middleware/auth');

// @route   GET api/jobs
// @desc    Get all jobs with pagination and filters
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, location, minSalary, maxSalary, search } = req.query;
        const skip = (Number(page) - 1) * Number(limit);

        // Build where clause
        const where = {};

        if (location) {
            where.location = { contains: location, mode: 'insensitive' };
        }

        if (minSalary || maxSalary) {
            where.salary = {};
            if (minSalary) where.salary.gte = Number(minSalary);
            if (maxSalary) where.salary.lte = Number(maxSalary);
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        const [jobs, total] = await Promise.all([
            prisma.job.findMany({
                where,
                include: {
                    employer: {
                        select: {
                            id: true,
                            username: true,
                            companyName: true,
                            companyWebsite: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: Number(limit)
            }),
            prisma.job.count({ where })
        ]);

        res.json({
            jobs,
            totalPages: Math.ceil(total / Number(limit)),
            currentPage: Number(page),
            total
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET api/jobs/employer/me
// @desc    Get current employer's jobs
// @access  Private (Employer only)
router.get('/employer/me', [auth, isEmployer], async (req, res) => {
    try {
        const jobs = await prisma.job.findMany({
            where: { employerId: req.user.id },
            orderBy: { createdAt: 'desc' }
        });

        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET api/jobs/:id
// @desc    Get job by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const job = await prisma.job.findUnique({
            where: { id: req.params.id },
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
        });

        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   POST api/jobs
// @desc    Create a job
// @access  Private (Employer only)
router.post('/', [auth, isEmployer], async (req, res) => {
    try {
        const { title, description, requirements, salary, location } = req.body;

        const job = await prisma.job.create({
            data: {
                title,
                description,
                requirements: requirements || [],
                salary: salary ? Number(salary) : null,
                location,
                employerId: req.user.id
            }
        });

        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   PUT api/jobs/:id
// @desc    Update a job
// @access  Private (Owner only)
router.put('/:id', auth, async (req, res) => {
    try {
        // Check if job exists and user owns it
        const existingJob = await prisma.job.findUnique({
            where: { id: req.params.id }
        });

        if (!existingJob) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        if (existingJob.employerId !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const { title, description, requirements, salary, location, status } = req.body;

        const updateData = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (requirements) updateData.requirements = requirements;
        if (salary !== undefined) updateData.salary = salary ? Number(salary) : null;
        if (location) updateData.location = location;
        if (status) updateData.status = status;

        const job = await prisma.job.update({
            where: { id: req.params.id },
            data: updateData
        });

        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   DELETE api/jobs/:id
// @desc    Delete a job
// @access  Private (Owner only)
router.delete('/:id', auth, async (req, res) => {
    try {
        const job = await prisma.job.findUnique({
            where: { id: req.params.id }
        });

        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        if (job.employerId !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await prisma.job.delete({
            where: { id: req.params.id }
        });

        res.json({ msg: 'Job removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;
