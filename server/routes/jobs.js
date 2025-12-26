const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Assuming you will create/have this middleware
const Job = require('../models/Job');
const User = require('../models/User');

// Middleware to check if user is an employer
const checkEmployer = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'employer') {
            return res.status(403).json({ msg: 'Access denied. Employers only.' });
        }
        next();
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// @route   POST api/jobs
// @desc    Create a job
// @access  Private (Employer only)
router.post('/', auth, checkEmployer, async (req, res) => {
    try {
        const { title, description, location, salaryRange, companyName } = req.body;

        // Optional: Update company profile if companyName is provided
        if (companyName) {
            await User.findByIdAndUpdate(req.user.id, {
                'companyProfile.companyName': companyName
            });
        }

        const newJob = new Job({
            recruiter: req.user.id,
            title,
            description,
            location,
            salaryRange
        });

        const job = await newJob.save();
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/jobs
// @desc    Get all jobs (for candidates) or My Jobs (for employer)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user.role === 'employer') {
            // Return jobs created by this employer
            const jobs = await Job.find({ recruiter: req.user.id }).sort({ createdAt: -1 });
            return res.json(jobs);
        } else {
            // Return all active jobs (basic feed implementation, will be replaced by swipe feed)
            const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
            return res.json(jobs);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/jobs/:id
// @desc    Get job by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }
        res.json(job);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Job not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/jobs/:id
// @desc    Update a job
// @access  Private (Owner only)
router.put('/:id', auth, checkEmployer, async (req, res) => {
    try {
        let job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        // Check user owns the job
        if (job.recruiter.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        const { title, description, location, salaryRange, isActive } = req.body;

        const jobFields = {};
        if (title) jobFields.title = title;
        if (description) jobFields.description = description;
        if (location) jobFields.location = location;
        if (salaryRange) jobFields.salaryRange = salaryRange;
        if (typeof isActive !== 'undefined') jobFields.isActive = isActive;

        job = await Job.findByIdAndUpdate(
            req.params.id,
            { $set: jobFields },
            { new: true }
        );

        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/jobs/:id
// @desc    Delete a job
// @access  Private (Owner only)
router.delete('/:id', auth, checkEmployer, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        // Check user owns the job
        if (job.recruiter.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await job.deleteOne();
        res.json({ msg: 'Job removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
