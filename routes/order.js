const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Get order by id
router.get("/:orderId", orderController.getOrderById);

module.exports = router;
