const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cartController.js");

router.get("/get/:userId", CartController.showAllCartByUserId);
router.post("/add/:userId", CartController.addCart);
router.put("/update/:cartId", CartController.updateCart);
router.delete("/softDelete/:cartId", CartController.softDeleteCart);
router.delete("/delete/:id", CartController.deleteCart);

module.exports = router;
