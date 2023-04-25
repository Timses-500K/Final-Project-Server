const express = require("express");
const router = express.Router();
const ItemController = require("../controllers/itemController.js");

router.get("/", ItemController.findAll);


module.exports = router;
