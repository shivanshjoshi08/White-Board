require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const drawingRoutes = require('./routes/drawings');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // To parse JSON bodies and increase payload size for image data

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// Routes
app.use('/api/drawings', drawingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));