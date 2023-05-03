const express = require("express");
const router = express.Router();
const AddressController = require("../controllers/addressController.js");

// Get a specific address by ID
router.get("/:userId/:addressId", AddressController.getAddressById);

// Create a new address
router.post("/:userId", AddressController.createAddress);

// Update an address
router.put("/:userId/:addressId", AddressController.updateAddress);

module.exports = router;
