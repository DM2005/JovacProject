// server.js - Main server file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection
mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rephome')
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Health
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Routes
app.use('/api/auth', require('./src/routes/auth.routes'));
app.use('/api/bookings', require('./src/routes/booking.routes'));

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({ message: err.message || 'Server error' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});