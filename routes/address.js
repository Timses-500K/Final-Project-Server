const express = require("express");
const router = express.Router();
const { Auth } = require('../middlewares/auth');
const AddressController = require("../controllers/addressController.js");

router.use( Auth.author)
// Find addresses by logged User
router.get("/", AddressController.findAddressloggedUser);

// Create a new address
router.post("/", AddressController.createAddress);

// Update an address
router.put("/:addressId", AddressController.updateAddress);

// Delete Address
router.delete("/:addressId", AddressController.deleteAddress);

module.exports = router;
