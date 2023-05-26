const { Order, Item, User, Address, Cart, OrderItem, CartItem, Size } = require("../models");

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

      res.json({ orders });
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
            model: OrderItem,
            as: "OrderItems",
            include: [
              {
                model: Item,
                as: "Item",
              },
            ],
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          {
            model: User,
            attributes: ["id", "firstName", "lastName", "email"],
          },
        ],
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      if (!order) {
        return next({ name: "ErrorNotFound" });
      }

      // Fetch the Address from User
      const user = await User.findByPk(order.userId);
      const address = await Address.findOne({
        where: { userId: user.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
      });

      // Retrieve all order items associated with the order ID
      const orderItems = await OrderItem.findAll({
        where: { orderId: order.id },
        include: [
          {
            model: Item,
            as: "Item",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
        ],
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      });

      order.dataValues.OrderItems = orderItems; // Add the order items to the order object

      res.status(200).json({ order, address });
    } catch (err) {
      next(err);
    }
  };

  static createOrder = async (req, res, next) => {
    const userId = req.user.id;

    try {
      const cart = await Cart.findOne({
        where: {
          userId: userId,
          deletedAt: null, // Check for deletedAt value equal to NULL
        },
        include: [
          {
            model: CartItem,
            as: "CartItems",
            include: [
              {
                model: Item,
                as: "Item",
              },
              {
                model: Size,
                as: "Size",
              },
            ],
          },
        ],
      });

      if (!cart) {
        return next({ name: "ErrorNotFound" });
      }

      const totalPriceForUser = cart.totalPrice;
      const totalPriceWithTax = totalPriceForUser * 0.11 + totalPriceForUser + 11000;

      const order = await Order.create({
        userId: cart.userId,
        cartId: cart.id,
        subtotal: cart.totalPrice,
        totalPrice: totalPriceWithTax.toFixed(2),
        status: "Belum Bayar",
      });

      const orderItems = cart.CartItems.map(cartItem => ({
        itemId: cartItem.Item.id,
        orderId: order.id,
        sizeId: cartItem.Size.id,
        quantity: cartItem.quantity,
      }));

      await OrderItem.bulkCreate(orderItems);

      // Perform a soft-deletion by calling destroy on the cart instance
      await cart.destroy();

      res.json({ message: "Order created successfully" });
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Error creating order" });
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
