const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed
    role: {
        type: String,
        enum: ['candidate', 'employer', 'admin'],
        default: 'candidate'
    },

    // Profile for Candidates
    candidateProfile: {
        fullName: String,
        resumeUrl: String, // Link to CV
        skills: [String],
        experience: [{
            title: String,
            company: String,
            duration: String,
            description: String
        }],
        education: [{
            degree: String,
            institution: String,
            year: String
        }]
    },

    // Profile for Employers
    companyProfile: {
        companyName: String,
        industry: String,
        website: String,
        description: String,
        logoUrl: String
    },

    // Interactions
    interactions: {
        savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
        appliedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
        likedCandidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // For employers
    },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
