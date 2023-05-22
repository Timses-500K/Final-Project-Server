const { Order, Item, User, Address, Cart, OrderItem } = require("../models");

class OrderController {
  static getAllOrder = async (req, res, next) => {
    try {
      const userId = req.user.id;

      const orders = await Order.findAll({
        where: {
          userId: userId,
        },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      if (!orders || orders.length === 0) {
        return next({ name: "ErrorNotFound" });
      }

      // Fetch order items for each order
      const orderIds = orders.map(order => order.id);
      const orderItems = await OrderItem.findAll({
        where: {
          orderId: orderIds,
        },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      // Group order items by order
      const ordersWithItems = orders.map(order => {
        const orderId = order.id;
        const items = orderItems.filter(item => item.orderId === orderId);

        return {
          order: order,
          orderItems: items,
        };
      });

      res.json({ ordersWithItems });
    } catch (error) {
      console.error("Error retrieving orders:", error);
      res.status(500).json({ message: "Error retrieving orders" });
    }
  };

  // Get order by id
  static getOrderById = async (req, res, next) => {
    const { orderId } = req.params;
    const userId = req.user.id;

    try {
      const order = await Order.findOne({
        where: {
          id: orderId,
          userId: userId,
        },
        include: [
          {
            model: Item,
            as: "orderItem",
            through: { attributes: ["orderId", "itemId", "quantity"] },
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          { model: User, attributes: ["id", "firstName", "lastName", "email"] },
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
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

  // Create order
  static createOrder = async (req, res, next) => {
    const userId = req.user.id;

    try {
      const carts = await Cart.findAll({
        where: {
          userId: userId,
        },
        include: [
          {
            model: Item,
            as: "cartItem",
            through: { attributes: ["quantity"] },
          },
        ],
      });

      if (!carts || carts.length === 0) {
        return next({ name: "ErrorNotFound" });
      }

      // Create orders and order items based on carts and cart items
      for (const cart of carts) {
        const totalPrice = (cart.totalPrice * 0.11 + 11000).toFixed(2);

        const order = await Order.create({
          userId: cart.userId,
          cartId: cart.id,
          subtotal: cart.totalPrice,
          totalPrice: totalPrice,
          status: "Pending",
        });

        const cartItems = cart.cartItem;
        for (const cartItem of cartItems) {
          await OrderItem.create({
            orderId: order.id,
            itemId: cartItem.id,
            quantity: cartItem.CartItem.quantity,
          });
        }
      }

      res.json({ message: "Orders created successfully" });
    } catch (error) {
      console.error("Error creating orders:", error);
      res.status(500).json({ message: "Error creating orders" });
    }
  };

  // Delete order by Id
  static deleteOrder = async (req, res, next) => {
    const { orderId } = req.params;
    const userId = req.user.id;

    try {
      const order = await Order.findOne({
        where: {
          id: orderId,
          userId: userId,
        },
      });

      if (order) {
        await order.destroy();
        res.status(200).json({ message: "Order deleted successfully" });
      } else {
        next({ name: "ErrorNotFound" });
      }
    } catch (err) {
      next(err);
    }
  };
}

module.exports = OrderController;
