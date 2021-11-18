const express = require("express");
const router = express.Router();
const existsToken = require("../middlewares/existsToken");

// sub-routers
const userRouters = require("./user");
const authRouters = require("./auth");
const productRouters = require("./product");

router.use("/user", existsToken, userRouters);
router.use("/auth", authRouters);
router.use("/product", productRouters);

module.exports = router;
