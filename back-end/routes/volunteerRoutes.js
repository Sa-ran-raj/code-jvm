const express = require('express');
const Volunteer = require('../models/Volunteer');
const router = express.Router();

// POST /api/volunteers - Create new volunteer
router.post('/volunteers', async (req, res) => {
    try {
        const volunteer = new Volunteer(req.body);
        await volunteer.save();
        res.status(201).json({ 
            success: true, 
            data: volunteer 
        });
    } catch (error) {
        console.error('Create volunteer error:', error);
        res.status(400).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// GET /api/volunteers/search - Search volunteers by location
router.get('/volunteers/search', async (req, res) => {
    try {
        const { location } = req.query;
        console.log('Searching for location:', location); // Debug log
        
        if (!location) {
            return res.status(400).json({ 
                success: false, 
                error: 'Location parameter is required' 
            });
        }

        // Case-insensitive search for location
        const volunteers = await Volunteer.find({
            location: { $regex: new RegExp(location, 'i') }
        });

        console.log('Found volunteers:', volunteers.length); // Debug log

        res.json({ 
            success: true, 
            data: volunteers,
            count: volunteers.length
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// GET /api/volunteers - Get all volunteers
router.get('/volunteers', async (req, res) => {
    try {
        const volunteers = await Volunteer.find();
        res.json({ 
            success: true, 
            data: volunteers 
        });
    } catch (error) {
        console.error('Get all volunteers error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

module.exports = router;