const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");

// Get specific user by ID
router.get("/:id", UserController.findById);

// Update user by ID
router.put("/:id", UserController.update);

// Delete user by ID
router.delete("/:id", UserController.delete);

module.exports = router;
