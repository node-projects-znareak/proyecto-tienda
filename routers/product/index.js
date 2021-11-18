const express = require("express");
const router = express.Router();
const productController = require("../../controllers/productController");

router.get("/", productController.getProducts);
router.post("/", productController.createProduct);
router.delete("/:id", productController.deleteProduct);
router.put("/:id", productController.updateProduct);
router.post("/import", productController.insertManyProducts);

module.exports = router;
