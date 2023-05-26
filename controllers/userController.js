const { User, Address, Order, Cart } = require("../models");

class UserController {
  // Get user by id by logged user
  static async findByLoggedUser(req, res, next) {
    const id  = req.user.id;
    try {
      const user = await User.findByPk( id, {
        include: [
          {
            model: Address,
            attributes: ["id", "addressName", "address", "city", "postalCode"],
          },
          {
            model: Order,
            attributes: ["id", "subtotal", "totalPrice", "status"],
          },
          // {
          //   model: Cart,
          //   attributes: ["id", "totalPrice","deletedAt"],
          // },
        ],
        attributes: {
          exclude: ["visibility","password"],
        },
      });

      if (user) {
        res.status(200).json(user);
      } else {
        next({ name: "UserNotFound" });
      }
    } catch (err) {
      next(err);
    }
  }

  // Update user by id
  static async update(req, res, next) {
    const id  = req.user.id;
    const { firstName, lastName, birth } = req.body;
    try {
      const user = await User.findByPk(id);
      if (user) {
        await user.update({
          // username: username || user.username,
          // email: email || user.email,
          // password: password || user.password,
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
          birth: birth || user.birth,
        });
        res.status(200).json({ message: "User updated successfully", user });
      } else {
        next({ name: "UserNotFound" });
      }
    } catch (err) {
      next(err);
    }
  }

  // Delete user by id
  // static async delete(req, res, next) {
  //   const id = req.user.id;
  //   try {
  //     const user = await User.findByPk(id);
  //     if (user) {
  //       await user.destroy();
  //       res.status(200).json({ message: "User deleted successfully", user });
  //     } else {
  //       next({ name: "UserNotFound" });
  //     }
  //   } catch (err) {
  //     next(err);
  //   }
  // }
}

module.exports = UserController;
