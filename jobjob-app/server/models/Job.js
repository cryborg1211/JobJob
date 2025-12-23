const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    employer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [String],
    salary: {
        min: Number,
        max: Number,
        currency: { type: String, default: 'VND' }
    },
    location: { type: String, required: true },
    type: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'],
        default: 'Full-time'
    },

    // Status
    isActive: { type: Boolean, default: true },

    // For Matching Engine
    keywords: [String], // Extracted keywords for better matching

    createdAt: { type: Date, default: Date.now },
    deadline: Date
});

module.exports = mongoose.model('Job', JobSchema);
