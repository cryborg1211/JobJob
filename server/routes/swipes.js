const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Swipe = require('../models/Swipe');
const Match = require('../models/Match');
const Job = require('../models/Job');
const User = require('../models/User');

// @route   POST api/swipes
// @desc    Swipe left or right
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const { targetId, type, targetModel } = req.body; // targetModel: 'Job' (for candidate) or 'User' (for recruiter)
        const userId = req.user.id;

        // Validation: Ensure valid type
        if (!['like', 'pass'].includes(type)) {
            return res.status(400).json({ msg: 'Invalid swipe type' });
        }

        // 1. Record the Swipe
        // Check if swipe already exists
        let swipe = await Swipe.findOne({ userId, targetId });
        if (swipe) {
            return res.status(400).json({ msg: 'Already swiped on this profile/job' });
        }

        swipe = new Swipe({
            userId,
            targetId,
            targetModel,
            type
        });

        await swipe.save();

        // 2. Check for Match (Only if it's a 'like')
        let isMatch = false;
        let matchData = null;

        if (type === 'like') {
            if (targetModel === 'Job') {
                // Current user is Candidate swiping on a Job
                // Check if the Recruiter of this Job has already liked the Candidate
                const job = await Job.findById(targetId);
                if (!job) return res.status(404).json({ msg: 'Job not found' });

                const recruiterId = job.recruiter;

                // Look for a swipe from Recruiter (userId=recruiterId) on Candidate (targetId=userId)
                const reciprocalSwipe = await Swipe.findOne({
                    userId: recruiterId,
                    targetId: userId,
                    type: 'like'
                });

                if (reciprocalSwipe) {
                    isMatch = true;
                    // Create Match
                    const newMatch = new Match({
                        jobId: targetId,
                        candidateId: userId,
                        recruiterId: recruiterId
                    });
                    await newMatch.save();
                    matchData = newMatch;
                }

            } else if (targetModel === 'User') {
                // Current user is Recruiter swiping on a Candidate
                // Check if Candidate has liked ANY of the Recruiter's jobs
                // NOTE: This is complex. Usually, a Recruiter swipes on a Candidate *for a specific Job*.
                // For MVP, let's assume the Recruiter selects a Job context before swiping, OR
                // we check if the candidate liked ANY job from this recruiter.
                // Let's assume the request body includes `jobId` context if it's a Recruiter.

                // However, standard Tinder flow:
                // Candidate sees Jobs.
                // Recruiter sees Candidates (filtered by Job requirements?).

                // Let's support an optional `jobId` in the body for Recruiters.
                const { jobId } = req.body;

                if (jobId) {
                    // Check if Candidate (targetId) liked this specific Job
                    const reciprocalSwipe = await Swipe.findOne({
                        userId: targetId,
                        targetId: jobId,
                        type: 'like'
                    });

                    if (reciprocalSwipe) {
                        isMatch = true;
                        const newMatch = new Match({
                            jobId: jobId,
                            candidateId: targetId,
                            recruiterId: userId
                        });
                        await newMatch.save();
                        matchData = newMatch;
                    }
                }
            }
        }

        res.json({ swipe, isMatch, match: matchData });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/swipes/candidates
// @desc    Get candidates for a recruiter to swipe on
// @access  Private (Employer only)
router.get('/candidates', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'employer') return res.status(403).json({ msg: 'Access denied' });

        // Get IDs of candidates already swiped
        const swipedIds = await Swipe.distinct('targetId', { userId: req.user.id });

        // Find candidates not in swipedIds
        // Limit to 10 for pagination/performance
        const candidates = await User.find({
            role: 'candidate',
            _id: { $nin: swipedIds }
        }).select('-password').limit(10);

        res.json(candidates);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/swipes/jobs
// @desc    Get jobs for a candidate to swipe on
// @access  Private (Candidate only)
router.get('/jobs', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.role !== 'candidate') return res.status(403).json({ msg: 'Access denied' });

        // Get IDs of jobs already swiped
        const swipedIds = await Swipe.distinct('targetId', { userId: req.user.id });

        // Find active jobs not in swipedIds
        const jobs = await Job.find({
            isActive: true,
            _id: { $nin: swipedIds }
        }).populate('recruiter', 'companyProfile').limit(10);

        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
