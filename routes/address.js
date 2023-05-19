const express = require("express");
const router = express.Router();
const { Auth } = require('../middlewares/auth');
const AddressController = require("../controllers/addressController.js");

// Get a specific address by ID
// router.get("/:userId/:addressId", Auth.authentication, AddressController.getAddressById);

// Find addresses by logged User
router.get("/", Auth.authentication, AddressController.findAddressloggedUser);

// Create a new address
router.post("/", Auth.authentication, AddressController.createAddress);

// Update an address
router.put("/:addressId", Auth.authentication , AddressController.updateAddress);

// Delete Address
router.delete("/:addressId", Auth.authentication, AddressController.deleteAddress);

module.exports = router;
