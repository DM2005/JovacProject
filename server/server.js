// server.js - Main server file
const express = require('express');
require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});