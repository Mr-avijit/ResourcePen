const express = require('express');
const router = express.Router();
const productRoutes = require('../modules/products/product.routes');
const seoRoutes = require('../modules/seo/seo.routes');

/**
 * MODULE MOUNTING PROTOCOL
 * Orchestrates the various domain nodes of the platform.
 */
router.use('/products', productRoutes);
router.use('/seo', seoRoutes);

// Health Pulse
router.get('/pulse', (req, res) => res.json({ status: 'Operational', timestamp: Date.now() }));

module.exports = router;