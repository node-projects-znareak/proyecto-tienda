const ProductService = require("../services/productService");
const { success, error } = require("../helpers/httpResponses");

class ProductController {
  getProducts(req, res) {
    ProductService.getAllProducts()
      .then((products) => success(res, products))
      .catch((err) => error(res, err));
  }

  getProduct(req, res) {
    ProductService.getProductById(req.params.id)
      .then((product) => success(res, product))
      .catch((err) => error(res, err));
  }

  createProduct(req, res) {
    ProductService.createProduct(req.body)
      .then((product) => success(res, product))
      .catch((err) => error(res, err));
  }

  updateProduct(req, res) {
    ProductService.updateProduct(req.params.id, req.body)
      .then((product) => success(res, product))
      .catch((err) => error(res, err));
  }

  deleteProduct(req, res) {
    ProductService.deleteProduct(req.params.id)
      .then((product) => success(res, product))
      .catch((err) => error(res, err));
  }

  insertManyProducts(req, res) {
    ProductService.insertManyProducts(req.body.products)
      .then((products) => success(res, products))
      .catch((err) => error(res, err));
  }
}

module.exports = new ProductController();
