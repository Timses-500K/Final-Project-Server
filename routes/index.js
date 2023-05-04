const express = require("express");
const router = express.Router();

const itemRouter = require("./item"),
      addressRouter = require ('./address'),
      adminRouter = require ('./admin'),
      cartRouter = require ('./cart'),
      dashboardRouter = require ('./dashboard'),
      homeRouter = require ('./home'),
      orderRouter = require ('./order'),
      productRouter = require ('./product'),
      productDetailRouter = require ('./productDetail'),
      userRouter = require ('./user');

router.use("/api/item", itemRouter);
// router.use("/api/address", addressRouter);
// router.use("/api/admin", adminRouter);
// router.use("/api/cart", cartRouter);
// router.use("/api/dashboard", dashboardRouter);
// router.use("/api/home", homeRouter);
// router.use("/api/order", orderRouter);
// router.use("/api/product", productRouter);
// router.use("/api/productDetail", productDetailRouter);
// router.use("/api/user", userRouter);

module.exports = router;