const { Order, Item, User } = require("../models");

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
            attributes: { exclude: ["visibility"] },
          },
          { model: User, attributes: ["id", "username", "email"] },
        ],
      });

      if (order) {
        res.status(200).json({ order });
      } else {
        next({ name: "ErrorNotFound" });
      }
    } catch (err) {
      next(err);
    }
  };
}

module.exports = OrderController;
