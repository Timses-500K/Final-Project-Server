const { Order, Item, User, Address, Cart } = require("../models");

class OrderController {
  // Get order by id
  static getOrderById = async (req, res, next) => {
    const { orderId } = req.params;

    try {
      const order = await Order.findByPk(orderId, {
        include: [
          {
            model: Item,
            as: "orderItem",
          },
          { model: User, attributes: ["id", "firstName", "lastName", "email"] },
        ],
      });

      if (!order) {
        return next({ name: "ErrorNotFound" });
      }

      // Fetch the Address from User
      const user = await User.findByPk(order.userId);
      const address = await Address.findOne({ where: { userId: user.id }, attributes: { exclude: ["createdAt", "updatedAt"] } });

      res.status(200).json({ order, address });
    } catch (err) {
      next(err);
    }
  };

  // Create order by userId
  static async createOrder(req, res, next) {
    const { userId } = req.params;

    try {
      const user = await User.findByPk(userId);

      if (user) {
        const cart = await Cart.findOne({
          where: {
            userId: user.id,
          },
          attributes: ["totalPrice"],
        });

        const totalPrice = cart ? cart.totalPrice : 0;
        const subtotal = cart ? cart.totalPrice : 0;

        const order = await Order.create({
          userId,
          subtotal,
          totalPrice,
          status: "Pending",
        });

        res.status(201).json({ message: "Order created successfully", order });
      } else {
        next({ name: "ErrorNotFound" });
      }
    } catch (err) {
      next(err);
    }
  }

  // Delete order by Id
  static async deleteOrder(req, res, next) {
    const { orderId } = req.params;

    try {
      const order = await Order.findByPk(orderId);

      if (order) {
        await order.destroy();
        res.status(200).json({ message: "Order deleted successfully" });
      } else {
        next({ name: "OrderNotFound", message: "Order not found" });
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = OrderController;
