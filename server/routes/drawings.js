const express = require('express');
const router = express.Router();
const Drawing = require('../models/Drawing');

// Route to save a new drawing
router.post('/', async (req, res) => {
    // Check if drawingData exists in the request body
    if (!req.body.drawingData) {
        return res.status(400).json({ message: 'Drawing data is required.' });
    }

    try {
        const newDrawing = new Drawing({
            drawingData: req.body.drawingData
        });
        const savedDrawing = await newDrawing.save();
        res.status(201).json(savedDrawing);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to get all drawings
router.get('/', async (req, res) => {
    try {
        const drawings = await Drawing.find().sort({ createdAt: -1 }); // Show newest first
        res.json(drawings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;