const express = require("express");
const router = express.Router();
const AddressController = require("../controllers/addressController.js");

// Get a specific address by ID
router.get("/:userId/:addressId", AddressController.getAddressById);

// Get a specific address by ID
router.post("/:userId", AddressController.createAddress);

// Create a new address
router.put("/:userId/:addressId", AddressController.updateAddress);

module.exports = router;
