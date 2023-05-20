const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const { Auth, auth } = require('../middlewares/auth');

// Get specific user by logged user
router.get("/", Auth.authentication, UserController.findByLoggedUser);

// Update user by ID
router.put("/", Auth.authentication, UserController.update);

// Delete user by ID
router.delete("/", Auth.authentication, UserController.delete);

// router.get("/", Auth.authentication, UserController.findUser);

module.exports = router;
