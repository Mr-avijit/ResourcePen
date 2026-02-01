const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const { errorHandler } = require('./core/errors');
const { rateLimiter } = require('./core/middlewares');

const app = express();

// --- Production Hardening ---
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined')); // Enterprise logging
app.use(rateLimiter);

// --- Global API Routing ---
app.use('/api/v1', routes);

// --- Health Check ---
app.get('/health', (req, res) => {
  res.json({
    status: 'Operational',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// --- Centralized Error handling ---
app.use(errorHandler);

module.exports = app;