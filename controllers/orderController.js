const { Order, Item, User, Address, Cart, OrderItem, CartItem, Size } = require("../models");

class OrderController {
  // Get all orders of logged user
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

  // Get order based on logged user's orderId
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

      res.status(200).json({ order });
    } catch (err) {
      next(err);
    }
  };

  // Create order based on logged user
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
        addressId: cart.addressId,
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

  // Updated order based on logged user's orderId
  static async updateOrder(req, res, next) {
    const { orderId } = req.params;
    const userId = req.user.id;
    const { payment } = req.body;

    try {
      const order = await Order.findOne({
        where: {
          id: orderId,
          userId: userId,
          status: "Belum Bayar",
        },
      });

      if (!order) {
        return next({ name: "ErrorNotFound" });
      }

      // Update the order status or any other fields as needed
      order.status = "Verifikasi Bukti Pembayaran";
      order.payment = payment || order.payment;
      await order.save();

      res.status(200).json({ message: "Order updated successfully" });
    } catch (err) {
      next(err);
    }
  }

  // Delete order based on logged user's  orderId
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
