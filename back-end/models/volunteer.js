const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    age: {
        type: Number,
        required: [true, 'Age is required'],
        min: [16, 'Must be at least 16 years old'],
        max: [100, 'Age cannot exceed 100']
    },
    gender: {
        type: String,
        required: [true, 'Gender is required'],
        enum: ['Male', 'Female', 'Other']
    },
    phoneNo: {
        type: String,
        required: [true, 'Phone number is required'],
        match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number']
    },
    volunteerLanguage: {
        type: String,
        required: [true, 'Language is required']
    },
    location: {
        type: String,
        required: [true, 'Location is required']
    },
    coordinates: {
        latitude: Number,
        longitude: Number
    },
    availableDates: [{
        type: Date
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Volunteer', volunteerSchema);