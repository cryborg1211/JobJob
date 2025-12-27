const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { auth, isEmployer } = require('../middleware/auth');

// Validation helpers
const isValidString = (str, minLen = 1, maxLen = 1000) =>
    typeof str === 'string' && str.trim().length >= minLen && str.trim().length <= maxLen;

const isValidStatus = (status) => ['active', 'inactive'].includes(status);

const sanitize = (str) => str?.trim() || '';

// @route   GET api/jobs
// @desc    Get all active jobs with pagination and filters
// @access  Public
router.get('/', async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
        const skip = (page - 1) * limit;

        const { location, minSalary, maxSalary, search } = req.query;

        // Build where clause - only show active jobs
        const where = { status: 'active' };

        if (location) {
            where.location = { contains: sanitize(location), mode: 'insensitive' };
        }

        if (minSalary || maxSalary) {
            where.salary = {};
            if (minSalary) where.salary.gte = Math.max(0, parseInt(minSalary) || 0);
            if (maxSalary) where.salary.lte = Math.max(0, parseInt(maxSalary) || 0);
        }

        if (search) {
            const searchTerm = sanitize(search);
            where.OR = [
                { title: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } }
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
                take: limit
            }),
            prisma.job.count({ where })
        ]);

        res.json({
            jobs,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
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

        // Validation
        if (!isValidString(title, 3, 200)) {
            return res.status(400).json({ msg: 'Title must be 3-200 characters' });
        }

        if (!isValidString(description, 10, 5000)) {
            return res.status(400).json({ msg: 'Description must be 10-5000 characters' });
        }

        if (!isValidString(location, 2, 100)) {
            return res.status(400).json({ msg: 'Location must be 2-100 characters' });
        }

        // Validate requirements array
        let validRequirements = [];
        if (requirements && Array.isArray(requirements)) {
            validRequirements = requirements
                .filter(r => typeof r === 'string' && r.trim().length > 0)
                .map(r => r.trim())
                .slice(0, 20); // Max 20 requirements
        }

        // Validate salary
        let validSalary = null;
        if (salary !== undefined && salary !== null && salary !== '') {
            validSalary = parseInt(salary);
            if (isNaN(validSalary) || validSalary < 0) {
                return res.status(400).json({ msg: 'Salary must be a positive number' });
            }
        }

        const job = await prisma.job.create({
            data: {
                title: sanitize(title),
                description: sanitize(description),
                requirements: validRequirements,
                salary: validSalary,
                location: sanitize(location),
                status: 'active',
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

        if (title !== undefined) {
            if (!isValidString(title, 3, 200)) {
                return res.status(400).json({ msg: 'Title must be 3-200 characters' });
            }
            updateData.title = sanitize(title);
        }

        if (description !== undefined) {
            if (!isValidString(description, 10, 5000)) {
                return res.status(400).json({ msg: 'Description must be 10-5000 characters' });
            }
            updateData.description = sanitize(description);
        }

        if (location !== undefined) {
            if (!isValidString(location, 2, 100)) {
                return res.status(400).json({ msg: 'Location must be 2-100 characters' });
            }
            updateData.location = sanitize(location);
        }

        if (requirements !== undefined) {
            if (Array.isArray(requirements)) {
                updateData.requirements = requirements
                    .filter(r => typeof r === 'string' && r.trim().length > 0)
                    .map(r => r.trim())
                    .slice(0, 20);
            }
        }

        if (salary !== undefined) {
            if (salary === null || salary === '') {
                updateData.salary = null;
            } else {
                const parsedSalary = parseInt(salary);
                if (isNaN(parsedSalary) || parsedSalary < 0) {
                    return res.status(400).json({ msg: 'Salary must be a positive number' });
                }
                updateData.salary = parsedSalary;
            }
        }

        if (status !== undefined) {
            if (!isValidStatus(status)) {
                return res.status(400).json({ msg: 'Status must be active or inactive' });
            }
            updateData.status = status;
        }

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
