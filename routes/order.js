const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { Auth } = require("../middlewares/auth.js");

//middleware
router.use(Auth.author);

// Get all orders of logged user
router.get("/", orderController.getAllOrder);

// Get order based on logged user's orderId
router.get("/:orderId", orderController.getOrderById);

// Create order based on logged user
router.post("/", orderController.createOrder);

// Updated order based on logged user's orderId
router.put("/:orderId", orderController.updateOrder);

// Delete order based on logged user's orderId
router.delete("/:orderId", orderController.deleteOrder);

module.exports = router;
