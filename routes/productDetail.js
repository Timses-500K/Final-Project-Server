const express = require("express");
const router = express.Router();
const ProductDetailController = require("../controllers/productDetailController.js");

router.get("/:id", ProductDetailController.findById);

module.exports = router;
