const express = require("express");
const router = express.Router();
const { Auth } = require("../middlewares/auth");
const CartController = require("../controllers/cartController.js");
const { Auth } = require("../middlewares/auth.js")

//middleware
router.use( Auth.author);

router.use(Auth.author);
router.get("/get/", CartController.showAllCartByUserId);
router.post("/add/", CartController.addCart);
router.put("/update/:cartItemId", CartController.updateCart);
router.delete("/delete/", CartController.deleteCart);
router.delete("/deleteCartItem/:cartItemId", CartController.deleteItemCart);

router.post("/addcart", CartController.addToCart);
router.get("/", CartController.showCarts);
module.exports = router;
