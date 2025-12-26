const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Match = require('../models/Match');
const Message = require('../models/Message');
const User = require('../models/User');

// @route   GET api/chat/matches
// @desc    Get all matches for the current user
// @access  Private
router.get('/matches', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        // Find matches where user is either candidate or recruiter
        const matches = await Match.find({
            $or: [{ candidateId: userId }, { recruiterId: userId }]
        })
        .populate('jobId', 'title companyName')
        .populate('candidateId', 'username candidateProfile')
        .populate('recruiterId', 'username companyProfile')
        .sort({ createdAt: -1 });

        res.json(matches);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/chat/:matchId
// @desc    Get messages for a specific match
// @access  Private
router.get('/:matchId', auth, async (req, res) => {
    try {
        const messages = await Message.find({ matchId: req.params.matchId })
            .sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/chat/:matchId
// @desc    Send a message
// @access  Private
router.post('/:matchId', auth, async (req, res) => {
    try {
        const { content } = req.body;
        const matchId = req.params.matchId;

        // Verify match ownership (optional but recommended)
        const match = await Match.findById(matchId);
        if (!match) return res.status(404).json({ msg: 'Match not found' });

        if (match.candidateId.toString() !== req.user.id && match.recruiterId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        const newMessage = new Message({
            matchId,
            senderId: req.user.id,
            content
        });

        const message = await newMessage.save();
        res.json(message);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
