const express = require("express");
const router = express.Router();
const LoginRegisterController = require("../controllers/loginRegisterController");



router.post("/register", LoginRegisterController.register);
router.post("/login", LoginRegisterController.login);

module.exports = router;
