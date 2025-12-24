const mongoose = require('mongoose');

const interactionSchema = new mongoose.Schema({
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    type: {
        type: String,
        enum: ['like', 'pass'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['candidate', 'employer'],
        default: 'candidate'
    },
    subscription: {
        plan: {
            type: String,
            default: 'free'
        },
        expiresAt: {
            type: Date
        }
    },
    candidateProfile: {
        skills: [String],
        experience: String,
        cvUrl: String
    },
    companyProfile: {
        companyName: String,
        website: String
    },
    interactions: [interactionSchema]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
