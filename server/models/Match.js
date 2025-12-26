const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recruiterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for fast retrieval of matches for a specific user or job
matchSchema.index({ candidateId: 1 });
matchSchema.index({ recruiterId: 1 });
matchSchema.index({ jobId: 1 });

module.exports = mongoose.model('Match', matchSchema);
