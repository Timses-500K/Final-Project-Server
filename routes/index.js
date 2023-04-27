const express = require("express");
const router = express.Router();

const itemRouter = require("./item");

router.use("/item", itemRouter);



module.exports = router;