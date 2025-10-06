const mongoose = require('mongoose');

const drawingSchema = new mongoose.Schema({
    name: { 
        type: String, 
        default: 'Untitled' 
    },
    drawingData: { 
        type: String, 
        required: true 
    }, // Base64 image data
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Drawing', drawingSchema);