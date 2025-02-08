const express = require('express');
const router = express.Router();
const Volunteer = require('../models/volunteer');

router.get('/search', async (req, res) => {
    try {
        const { location, language } = req.query;

        // Build the base query object
        const query = {};

        // Add location search if provided
        if (location && location.trim()) {
            // Split the location into parts to handle multiple components
            const locationParts = location.trim().split(',').map(part => part.trim());
            
            // Create an array of location patterns to match
            const locationPatterns = locationParts.map(part => ({
                location: {
                    $regex: part,
                    $options: 'i'
                }
            }));

            // Use $or to match any of the location parts
            if (locationPatterns.length > 0) {
                query.$or = locationPatterns;
            }
        }

        // Add language filter if provided
        if (language && language !== 'Any Language') {
            query.volunteerLanguage = {
                $regex: `^${language}$`, // Exact match with case insensitive
                $options: 'i'
            };
        }

        // Find volunteers matching the criteria
        const volunteers = await Volunteer.find(query)
            .sort({ 'availableDates': -1 }) // Sort by availability, most recent first
            .limit(50); // Limit results to prevent overwhelming response

        // Format the response
        const response = {
            count: volunteers.length,
            searchCriteria: {
                location: location || 'All locations',
                language: language || 'All languages'
            },
            volunteers: volunteers.map(volunteer => ({
                _id: volunteer._id,
                name: volunteer.name,
                gender: volunteer.gender,
                age: volunteer.age,
                volunteerLanguage: volunteer.volunteerLanguage,
                location: volunteer.location,
                availableDates: volunteer.availableDates,
                coordinates: volunteer.coordinates
            }))
        };

        res.json(response);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ 
            error: 'Failed to search volunteers',
            details: error.message 
        });
    }
});

// Endpoint to get volunteer details by ID
router.get('/:id', async (req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);
        if (!volunteer) {
            return res.status(404).json({ error: 'Volunteer not found' });
        }
        res.json(volunteer);
    } catch (error) {
        console.error('Volunteer fetch error:', error);
        res.status(500).json({ error: 'Failed to fetch volunteer details' });
    }
});

// Health check endpoint
router.get('/health-check', (req, res) => {
    res.status(200).json({ 
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;