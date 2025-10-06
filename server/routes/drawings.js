const express = require('express');
const router = express.Router();
const Drawing = require('../models/Drawing');

// Route to save a new drawing
router.post('/', async (req, res) => {
    console.log("Request Body Received:", req.body);

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

router.delete('/:id', async (req, res) => {
    try {
        const drawingId = req.params.id;
        const deletedDrawing = await Drawing.findByIdAndDelete(drawingId);

        if (!deletedDrawing) {
            return res.status(404).json({ message: 'Drawing not found.' });
        }

        res.json({ message: 'Drawing deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;