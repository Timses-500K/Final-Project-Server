const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cartController.js");
const { Auth } = require("../middlewares/auth.js")

//middleware
router.use( Auth.author);

router.get("/get/:userId", CartController.showAllCartByUserId);
router.post("/add/:userId", CartController.addCart);
router.put("/update/:cartId", CartController.updateCart);
// router.delete("/softDelete/:cartId", CartController.softDeleteCart);
router.delete("/delete/:cartId", CartController.deleteCart);

router.post("/addcart", CartController.addToCart);
router.get("/", CartController.showCarts);
module.exports = router;
