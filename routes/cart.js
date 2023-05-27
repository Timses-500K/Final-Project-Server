const express = require("express");
const router = express.Router();
const { Auth } = require("../middlewares/auth");
const CartController = require("../controllers/cartController.js");

router.use(Auth.author);
router.get("/get/", CartController.showAllCartByUserId);
router.post("/add/", CartController.addCart);
router.put("/update/:cartItemId", CartController.updateCart);
router.delete("/delete/", CartController.deleteCart);
router.delete("/deleteCartItem/:cartItemId", CartController.deleteItemCart);

module.exports = router;
