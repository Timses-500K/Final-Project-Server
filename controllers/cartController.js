const { Cart, Item, CartItem, ItemSize, Size } = require("../models");

class CartController {
  static showAllCartByUserId = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const cart = await Cart.findOne({
        where: {
          userId,
          visibility: "True",
        },
        attributes: ["id", "userId", "totalPrice"],
      });
      if (!cart) {
        throw { name: "CartNotFound" };
      }

      const cartItem = await CartItem.findAll({
        where: {
          cartId: cart.id,
        },
        attributes: ["itemId", "quantity", "cartId"],
        order: [["cartId", "ASC"]],
        include: [
          {
            model: Item,
            attributes: ["itemName", "price", "imageUrl"],
            // include: [
            // 	{
            // 		model: Size,
            // 		as: "itemSize",
            // 		through: { attributes: [] },
            // 		attributes: ["id", "size"],
            // 	},
            // ],
          },
          {
            model: Size,
            attributes: ["size"],
          },
          // {
          // 	model: Cart,
          // 	attributes: ["totalPrice"],
          // },
        ],
      });

      res.status(200).json({ cartItem, cart });
      // res.status(200).json(cartItem);
    } catch (err) {
      next(err);
    }
  };

  static addCart = async (req, res, next) => {
    try {
      const autoFillVisibility = "True";
      const autoFillUpdatedAt = new Date();
      const autoFillCreateddAt = new Date();
      const userId = req.user.id;
      const { addressId, itemId, quantity, sizeId } = req.body;

      const item = await Item.findOne({
        where: {
          id: itemId,
        },
      });
      if (!item) {
        throw { name: "ItemNotFound" };
      }
      const price = item.price;
      const totalPrice = price * quantity;

      const userCart = await Cart.findOne({
        where: {
          userId,
          visibility: "True",
        },
      });
      if (!userCart) {
        // Make a cart and cart item if the user doesn't have any active cart
        const newCart = await Cart.create({
          userId,
          addressId,
          totalPrice,
          visibility: autoFillVisibility,
          createdAt: autoFillCreateddAt,
          updatedAt: autoFillUpdatedAt,
        });

        const newCartItem = await CartItem.create({
          cartId: newCart.id,
          itemId,
          quantity,
          sizeId,
          createdAt: autoFillCreateddAt,
          updatedAt: autoFillUpdatedAt,
        });

        res.status(201).json({
          newCart,
          newCartItem,
          message: "Cart created successfully",
        });
      }

      // check if the item has the size
      const cekSize = await ItemSize.findOne({
        where: {
          itemId,
          sizeId,
        },
      });
      if (!cekSize) {
        throw { name: "SizeNotFound" };
      }

      // find all cart item which belongs to the user
      const cartItem = await CartItem.findAll({
        where: {
          cartId: userCart.id,
        },
      });

      // extracts the property from cartItem and adds it to the new array
      const itemIdCartItem = cartItem.map(cartItem => cartItem.itemId);
      const sizeIdCartItem = cartItem.map(cartItem => cartItem.sizeId);

      // This code will check if the user already has the same item and size in the cart
      // if true it'll just update the item quantity,if not then the code will create a new cart item
      if (itemIdCartItem.includes(itemId) && sizeIdCartItem.includes(sizeId)) {
        const cartItem = await CartItem.findOne({
          where: {
            cartId: userCart.id,
            itemId,
          },
        });

        const priceDifference = price * cartItem.quantity - totalPrice;

        const putCart = await Cart.update(
          {
            totalPrice: userCart.totalPrice - priceDifference,
            updatedAt: autoFillUpdatedAt,
          },
          {
            where: {
              id: cartItem.cartId,
            },
          }
        );

        const cart = await Cart.findOne({
          where: {
            id: cartItem.cartId,
          },
        });

        const putCartItem = await CartItem.update(
          {
            quantity,
            updatedAt: autoFillUpdatedAt,
          },
          {
            where: {
              cartId: cartItem.cartId,
            },
          }
        );

        res.status(201).json({
          cart,
          cartItem,
          message: "Quantity updated successfully",
        });
      } else {
        // this is when user try to add another item to the cart
        const putCart = await Cart.update(
          {
            totalPrice: userCart.totalPrice + totalPrice,
            updatedAt: autoFillUpdatedAt,
          },
          {
            where: {
              id: userCart.id,
            },
          }
        );

        const showCart = await Cart.findOne({
          where: {
            id: userCart.id,
          },
        });

        const newCartItem = await CartItem.create({
          cartId: userCart.id,
          itemId,
          quantity,
          sizeId,
          createdAt: autoFillCreateddAt,
          updatedAt: autoFillUpdatedAt,
        });

        res.status(201).json({
          showCart,
          newCartItem,
          message: "Item added to cart successfully",
        });
      }
    } catch (err) {
      next(err);
    }
  };

  static updateCart = async (req, res, next) => {
    try {
      const autoFillUpdatedAt = new Date();
      const { quantity, sizeId } = req.body;
      const { cartItemId } = req.params;
      const userId = req.user.id;

      // Find the cart to be updated
      const cart = await Cart.findOne({
        where: {
          userId,
          visibility: "True",
        },
      });
      if (!cart) {
        throw { name: "CartNotFound" };
      }

      // find cart item to be updated
      const cartItem = await CartItem.findOne({
        where: {
          id: cartItemId,
        },
      });
      if (!cartItem) {
        throw { name: "CartNotFound" };
      }

      // check if the item has the size
      const cekSize = await ItemSize.findOne({
        where: {
          itemId: cartItem.itemId,
          sizeId,
        },
      });
      if (!cekSize) {
        throw { name: "SizeNotFound" };
      }

      // find the item
      const item = await Item.findOne({
        where: {
          id: cartItem.itemId,
        },
      });
      if (!item) {
        throw { name: "ItemNotFound" };
      }
      const price = item.price;

      const totalPrice = price * quantity;
      const priceDifference = price * cartItem.quantity - totalPrice;

      // Update the cart's properties
      cart.totalPrice -= priceDifference;
      cart.updatedAt = autoFillUpdatedAt;
      cartItem.quantity = quantity;
      cartItem.sizeId = sizeId;
      cartItem.updatedAt = autoFillUpdatedAt;

      // Save the updated item
      await cart.save();
      await cartItem.save();

      res.status(200).json({
        cart,
        cartItem,
        message: "Cart has been updated",
      });
    } catch (err) {
      next(err);
    }
  };

  static deleteCart = async (req, res, next) => {
    try {
      const userId = req.user.id;

      // check if the user has active cart
      const cart = await Cart.findOne({
        where: {
          userId,
          visibility: "True",
        },
      });
      if (!cart) {
        throw { name: "CartNotFound" };
      }

      const softDelete = await Cart.destroy({
        where: {
          id: cart.id,
        },
        // enable below code if you really want to delete the data(hard delete)
        // force: true,
      });
      cart.visibility = "False";
      await cart.save();

      const deleteCartItem = await CartItem.destroy({
        where: {
          cartId: cart.id,
        },
      });

      res.status(201).json({ message: "Delete success" });
    } catch (err) {
      next(err);
    }
  };

  static deleteItemCart = async (req, res, next) => {
    try {
      const autoFillUpdatedAt = new Date();
      const { cartItemId } = req.params;
      const userId = req.user.id;

      const cartItem = await CartItem.findOne({
        where: {
          id: cartItemId,
        },
      });
      if (!cartItem) {
        throw { name: "CartNotFound" };
      }

      const item = await Item.findOne({
        where: {
          id: cartItem.itemId,
        },
      });

      const findCart = await Cart.findOne({
        where: {
          userId,
          visibility: "True",
        },
      });
      if (!findCart) {
        throw { name: "CartNotFound" };
      }

      const currentTotalPrice = findCart.totalPrice;
      const minus = item.price * cartItem.quantity;

      const cart = await Cart.update(
        {
          totalPrice: currentTotalPrice - minus,
          updatedAt: autoFillUpdatedAt,
        },
        {
          where: {
            id: findCart.id,
          },
        }
      );

      const deleteCartItem = await CartItem.destroy({
        where: {
          id: cartItemId,
        },
      });

      res.status(200).json({
        message: "Cart Item has been deleted",
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = CartController;
