const mongoose = require('mongoose');

const swipeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true // Can be a User ID (for recruiter swiping candidate) or Job ID (for candidate swiping job)
    },
    targetModel: {
        type: String,
        required: true,
        enum: ['User', 'Job'] // Polymorphic reference
    },
    type: {
        type: String,
        enum: ['like', 'pass'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index to quickly check if a user has already swiped on a target
swipeSchema.index({ userId: 1, targetId: 1 }, { unique: true });

module.exports = mongoose.model('Swipe', swipeSchema);
