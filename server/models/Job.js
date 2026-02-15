const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a job title'],
        trim: true
    },
    company: {
        type: String,
        required: [true, 'Please add a company name'],
        trim: true
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    type: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'],
        default: 'Full-time'
    },
    tags: {
        type: [String],
        default: []
    },
    field: {
        type: String,
        required: [true, 'Please select a field'],
        enum: ['Design', 'Engineering', 'Marketing', 'Finance', 'Education', 'Healthcare', 'Legal', 'Operations', 'Sales', 'Other']
    },
    description: String, // Kept for backward compatibility if needed, or mapped to 'about'
    about: {
        type: String,
        required: [true, 'Please add a job description']
    },
    requirements: {
        type: [String],
        default: []
    },
    benefits: {
        type: [String],
        default: []
    },
    postedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Job', JobSchema);
