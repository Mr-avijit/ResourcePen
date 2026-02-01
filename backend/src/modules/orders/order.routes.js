const express = require('express');
const router = express.Router();
const OrderController = require('./order.controller');
const { authenticate } = require('../../middleware/auth');

router.post('/checkout', authenticate, OrderController.createOrder);
router.get('/invoices/:id', authenticate, OrderController.getInvoice);

module.exports = router;