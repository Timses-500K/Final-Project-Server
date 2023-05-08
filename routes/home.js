const express = require("express");
const router = express.Router();
const HomeController = require("../controllers/homeController.js");

router.get("/", HomeController.findAll);
// router.get("/", HomeController.findAllCategory);



module.exports = router;
