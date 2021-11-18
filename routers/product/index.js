const express = require("express");
const router = express.Router();
const productController = require("../../controllers/productController");
const existsToken = require("../../middlewares/existsToken");

router.get("/", productController.getProducts);
router.post("/", existsToken, productController.createProduct);
router.delete("/:id", existsToken, productController.deleteProduct);
router.put("/:id", existsToken, productController.updateProduct);
router.post("/import", existsToken, productController.insertManyProducts);

module.exports = router;
