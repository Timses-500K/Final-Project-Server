const express = require("express");
const router = express.Router();

const addressRouter = require("./address");
const adminRouter = require("./admin");
const cartRouter = require("./cart");
const cartItemRouter = require("./cartItem");
const categoryRouter = require("./category");
const categoryItemRouter = require("./categoryItem");
const itemRouter = require("./item");
const itemSizeRouter = require("./itemSize");
const orderRouter = require("./order");
const orderItemRouter = require("./orderItem");
const sizeRouter = require("./size");
const userRouter = require("./user");


// router.use("/address", addressRouter);
// router.use("/admin", adminRouter);
// router.use("/cart", cartRouter);
// router.use("/cartitem", cartItemRouter);
// router.use("/category", categoryRouter);
// router.use("/categoryitem", categoryItemRouter);
router.use("/item", itemRouter);
// router.use("/itemsize", itemSizeRouter);
// router.use("/order", orderRouter);
// router.use("/orderitem", orderItemRouter);
// router.use("/size", sizeRouter);
// router.use("/user", userRouter);


module.exports = router;