const express = require('express');
const router = express.Router();

// Existing Node Imports
const auth = require('../modules/auth/auth.routes');
const products = require('../modules/products/product.routes');
const seo = require('../modules/seo/seo.routes');
const referrals = require('../modules/referral/referral.routes');
const orders = require('../modules/orders/order.routes');
const cms = require('../modules/cms/cms.routes');

// New Node Imports
const users = require('../modules/users/user.routes');
const reviews = require('../modules/reviews/review.routes');
const analytics = require('../modules/analytics/analytics.routes');

// Mounting Protocols
router.use('/auth', auth);
router.use('/users', users);
router.use('/products', products);
router.use('/seo', seo);
router.use('/referrals', referrals);
router.use('/orders', orders);
router.use('/cms', cms);
router.use('/reviews', reviews);
router.use('/analytics', analytics);

// Health Pulse
router.get('/health', (req, res) => res.json({ status: 'Operational', uptime: process.uptime() }));

module.exports = router;