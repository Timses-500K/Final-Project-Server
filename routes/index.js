const express = require("express");
const router = express.Router();

const itemRouter = require("./item");
const dashboardRouter = require("./dashboard");
const orderRouter = require("./order.js")

router.use("/item", itemRouter);
router.use("/dashboard", dashboardRouter )
router.use("/order", orderRouter)


module.exports = router;