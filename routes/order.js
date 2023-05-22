const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { Auth } = require("../middlewares/auth");

// Get all order based on user
router.get("/", Auth.authentication, orderController.getAllOrder);

// Get order by id
router.get("/:orderId", Auth.authentication, orderController.getOrderById);

// Create order by userId
router.post("/", Auth.authentication, orderController.createOrder);

// Delete order by id
router.delete("/:orderId", Auth.authentication, orderController.deleteOrder);

module.exports = router;
