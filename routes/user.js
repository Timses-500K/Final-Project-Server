const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const { Auth } = require('../middlewares/auth');

//middleware
router.use( Auth.author)

// Get specific user by logged user
router.get("/", UserController.findByLoggedUser);

// Update user by ID
router.put("/", UserController.update);

// Delete user by ID
router.delete("/", UserController.delete);


module.exports = router;
