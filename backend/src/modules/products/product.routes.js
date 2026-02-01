const express = require('express');
const router = express.Router();
const ProductController = require('./product.controller');
const { authenticate } = require('../../middleware/auth');
const { checkPermission } = require('../../core/guards');

router.get('/', ProductController.getAll);
router.get('/:id', ProductController.getOne);
router.post('/', authenticate, checkPermission('manage_projects'), ProductController.create);

module.exports = router;