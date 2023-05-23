const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/productController.js");

router.get("/", ProductController.findAllItem);
router.get("/:id", ProductController.findAllByCat);

module.exports = router;
