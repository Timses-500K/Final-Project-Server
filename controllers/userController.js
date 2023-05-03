const { User, Address, Order, Cart } = require("../models");

class UserController {
  // Get user by id
  static async findById(req, res, next) {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id, {
        include: [
          {
            model: Address,
            attributes: ["id", "addressName", "address", "city", "postalCode"],
          },
          {
            model: Order,
            attributes: ["id", "subtotal", "totalPrice", "status"],
          },
          {
            model: Cart,
            attributes: ["id", "totalPrice"],
          },
        ],
        attributes: {
          exclude: ["visibility"],
        },
      });

      if (user) {
        res.status(200).json(user);
      } else {
        next({ name: "ErrorNotFound" });
      }
    } catch (err) {
      next(err);
    }
  }

  // Update user by id
  static async update(req, res, next) {
    const { id } = req.params;
    const { username, email, password, firstName, lastName, birth, visibility } = req.body;
    try {
      const user = await User.findByPk(id);
      if (user) {
        await user.update({
          username: username || user.username,
          email: email || user.email,
          password: password || user.password,
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
          birth: birth || user.birth,
          visibility: visibility || user.visibility,
        });
        res.status(200).json({ message: "User updated successfully", user });
      } else {
        next({ name: "ErrorNotFound" });
      }
    } catch (err) {
      next(err);
    }
  }

  // Delete user by id
  static async delete(req, res, next) {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      if (user) {
        await user.destroy();
        res.status(200).json({ message: "User deleted successfully", user });
      } else {
        next({ name: "ErrorNotFound" });
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = UserController;
