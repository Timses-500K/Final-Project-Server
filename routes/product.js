const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/productController.js");

router.get("/", ProductController.findAllItem);
router.get("/:categoryName", ProductController.findAllByCat);

module.exports = router;
