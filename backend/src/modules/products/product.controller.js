const ProductService = require('./product.service');

/**
 * ASSET ORCHESTRATION CONTROLLER
 */
class ProductController {
  async getAll(req, res, next) {
    try {
      const products = await ProductService.listAll();
      res.json(products);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const product = await ProductService.genesis(req.body);
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  }

  async getOne(req, res, next) {
    try {
      const product = await ProductService.findById(req.params.id);
      res.json(product);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProductController();