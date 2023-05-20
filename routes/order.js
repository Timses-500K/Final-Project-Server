const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Get order by id
router.get("/:orderId", orderController.getOrderById);

// Create order by userId
router.post("/:userId", orderController.createOrder);

// Delete order by id
router.delete("/:orderId", orderController.deleteOrder);

module.exports = router;
