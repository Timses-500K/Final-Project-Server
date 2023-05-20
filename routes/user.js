const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const { Auth } = require('../middlewares/auth');

// Get specific user by logged user
router.get("/", Auth.authentication, UserController.findByLoggedUser);

// Update user by ID
router.put("/", Auth.authentication, UserController.update);

// Delete user by ID
router.delete("/", Auth.authentication, UserController.delete);


module.exports = router;
