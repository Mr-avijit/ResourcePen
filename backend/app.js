const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('./routes');
const { errorHandler } = require('./core/errors');

const app = express();

// --- Production Hardening ---
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

// --- Global API Routing ---
app.use('/api/v1', routes);

// --- Global Error Handling Node ---
app.use(errorHandler);

module.exports = app;