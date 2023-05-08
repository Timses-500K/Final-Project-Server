const express = require("express");
const router = express.Router();
const LoginRegisterController = require("../controllers/loginRegisterController");

router.post("/", LoginRegisterController.register);
router.get("/", LoginRegisterController.login);


module.exports = router;
