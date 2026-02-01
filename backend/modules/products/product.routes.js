const express = require('express');
const router = express.Router();
const ProductService = require('./product.service');
const { success } = require('../../core/responses');

router.get('/', async (req, res, next) => {
  try {
    const products = await ProductService.listAll();
    return success(res, products, 'Asset manifest retrieved.');
  } catch (err) {
    next(err);
  }
});

module.exports = router;