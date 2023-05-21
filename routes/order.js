const express = require("express");
const router = express.Router();
const authenticateUser = require("../middlewares/authenticateUser");
const OrderController = require("../controllers/orderController.js");

//ItemApi
router.get("/item", OrderController.findAllItem);
router.get("/item/:id", OrderController.findOne);
//UserApi
router.post("/user", OrderController.createUser);
router.post("/user/login", OrderController.login);
router.get("/user/profile/:id", authenticateUser, OrderController.getUserProfile);
router.put("/user/profile", OrderController.updateProfile);

//OrderApi
router.post("/order", OrderController.createOrder);
router.get("/order/:id", OrderController.getOrderById);
router.get("/order", OrderController.getAllOrder);
router.put("/order", OrderController.updateOrder);
router.delete("/order/:id", OrderController.deleteOrder);

module.exports = router;