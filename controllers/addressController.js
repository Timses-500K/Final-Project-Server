const { Address, User } = require("../models");

class AddressController {
  // Get address by Id
  static getAddressById = async (req, res, next) => {
    const { userId, addressId } = req.params;

    try {
      const address = await Address.findOne({
        where: {
          id: addressId,
          userId,
        },
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      if (address) {
        res.status(200).json({ address });
      } else {
        next({ name: "ErrorNotFound" });
      }
    } catch (err) {
      next(err);
    }
  };

  // Create address by userId
  static createAddress = async (req, res, next) => {
    const { userId } = req.params;
    const { addressName, address, city, postalCode } = req.body;

    try {
      const user = await User.findByPk(userId);
      if (user) {
        const newAddress = await Address.create({
          userId,
          addressName,
          address,
          city,
          postalCode,
        });
        res.status(201).json({ message: "Address created successfully", newAddress });
      } else {
        next({ name: "ErrorNotFound" });
      }
    } catch (err) {
      next(err);
    }
  };

  // Update address
  static updateAddress = async (req, res, next) => {
    const { userId, addressId } = req.params;
    const { addressName, address, city, postalCode } = req.body;
    try {
      const addressToUpdate = await Address.findOne({
        where: {
          id: addressId,
          userId,
        },
      });

      if (addressToUpdate) {
        const updatedAddress = await addressToUpdate.update({
          addressName: addressName || addressToUpdate.addressName,
          address: address || addressToUpdate.address,
          city: city || addressToUpdate.city,
          postalCode: postalCode || addressToUpdate.postalCode,
        });
        res.status(200).json({ message: "Address updated successfully", address: updatedAddress });
      } else {
        next({ name: "ErrorNotFound" });
      }
    } catch (err) {
      next(err);
    }
  };
}

module.exports = AddressController;
