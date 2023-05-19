const { Address, User } = require("../models");

class AddressController {
  // Get address by Id
  // static getAddressById = async (req, res, next) => {
  //   const { userId, addressId } = req.params;

  //   try {
  //     const address = await Address.findOne({
  //       where: {
  //         id: addressId,
  //         userId,
  //       },
  //       attributes: {
  //         exclude: ["createdAt", "updatedAt"],
  //       },
  //     });

  //     if (address) {
  //       res.status(200).json({ address });
  //     } else {
  //       next({ name: "ErrorNotFound" });
  //     }
  //   } catch (err) {
  //     next(err);
  //   }
  // };

  // Create address by logged User
  static createAddress = async (req, res, next) => {
    const userId = req.user.id;
    const { addressName, address, city, postalCode } = req.body;

    try {
      const user = await User.findByPk(userId);
      if (user) {
        const newAddress = await Address.create({
          userId:userId,
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

  // Update address by logged User
  static updateAddress = async (req, res, next) => {
    const userId = req.user.id;
    const { addressId } = req.params;
    const { addressName, address, city, postalCode } = req.body;
    try {
      const addressToUpdate = await Address.findOne({
        where: {
          id: addressId,
          userId: userId,
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

  // Find Addresses by logged user
  static async findAddressloggedUser(req, res, next){
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId, {
        // attributes: [],
        include:[
          {
            model: Address,
            where:{
              userId: userId
            },
            // order:[[ "id", "DESC" ]]
          }
        ],
      });

      if(!user){
        next({name: "UserNotFound"});
      }
      res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };

  // Delete Address
  static async deleteAddress(req, res, next) {
    try {
      const userId = req.user.id;
      const {addressId} = req.params;
      const address = await Address.findByPk(addressId, {
        where: {
          userId: userId,
        },
      });
      if (address) {
        await address.destroy();
        res.status(200).json({ message: "Address deleted successfully" });
      } else {
        next({ name: "AddressNotFound" });
      }
    } catch (err) {
      next(err);
    }
  }
};

module.exports = AddressController;
