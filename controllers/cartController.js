const { Cart, Item, CartItem, ItemSize, Size } = require("../models");

class CartController {
	static showAllCartByUserId = async (req, res, next) => {
		try {
			const { userId } = req.params;
			const cart = await Cart.findAll({
				where: {
					userId,
					visibility: "True",
				},
			});
			if (cart[0] == null) {
				throw { name: "ErrorNotFound" };
				// throw { name: "CartNotFound" };
			}

			// create a new array that contains only the id values of each index in the cart array.
			const cartIds = cart.map((cart) => cart.id);

			const cartItem = await CartItem.findAll({
				where: {
					cartId: cartIds,
				},
				attributes: ["itemId", "cartId", "quantity"],
				order: [["cartId", "ASC"]],
				include: [
					{
						model: Item,
						attributes: ["itemName", "price", "imageUrl"],
						include: [
							{
								model: Size,
								as: "itemSize",
								through: { attributes: [] },
								attributes: ["size"],
							},
						],
					},
					{
						model: Cart,
						attributes: ["totalPrice"],
					},
				],
			});

			res.status(200).json(cartItem);
		} catch (err) {
			next(err);
		}
	};

	static addCart = async (req, res, next) => {
		try {
			const autoFillVisibility = "True";
			const autoFillUpdatedAt = new Date();
			const autoFillCreateddAt = new Date();
			const { userId, addressId, itemId, quantity } = req.body;

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
				createdAt: autoFillCreateddAt,
				updatedAt: autoFillUpdatedAt,
			});

			res.status(201).json({
				newCart,
				newCartItem,
			});
		} catch (err) {
			next(err);
		}
	};

	static updateCart = async (req, res, next) => {
		try {
			const autoFillUpdatedAt = new Date();
			const { quantity } = req.body;
			const { cartId } = req.params;

			// Find the cart to be updated
			const cart = await Cart.findOne({
				where: {
					id: cartId,
					visibility: "True",
				},
			});
			if (!cart) {
				throw { name: "ErrorNotFound" };
				// throw { name: "CartNotFound" };
			}

			// find cart item to be updated
			const cartItem = await CartItem.findOne({
				where: {
					cartId: cart.id,
				},
			});

			const item = await Item.findOne({
				where: {
					id: cartItem.itemId,
				},
			});
			const totalPrice = item.price * quantity;

			// Update the cart's properties
			cart.totalPrice = totalPrice;
			cart.updatedAt = autoFillUpdatedAt;
			cartItem.quantity = quantity;
			cartItem.updatedAt = autoFillUpdatedAt;

			// Save the updated item
			await cart.save();
			await cartItem.save();

			res.status(200).json({
				cart,
				cartItem,
				message: "Data berhasil berubah",
			});
		} catch (err) {
			next(err);
		}
	};

	static softDeleteCart = async (req, res, next) => {
		try {
			const { cartId } = req.params;
			const data = await Cart.update(
				{
					visibility: "False",
				},
				{
					where: {
						id: cartId,
					},
				}
			);

			if (data[0] === 1) {
				res.status(200).json({
					message: "Deleted successfully",
				});
			} else {
				throw { name: "ErrorNotFound" };
				throw { name: "CartNotFound" };
			}
		} catch (err) {
			next(err);
		}
	};

	static deleteCart = async (req, res, next) => {
		try {
			const { id } = req.params;
			const find = await Cart.findOne({
				where: {
					id,
				},
			});
			if (!find) {
				throw { name: "ErrorNotFound" };
				// throw { name: "CartNotFound" };
			}
			const data = await Cart.destroy({
				where: {
					id,
				},
			});
			res.status(200).json({ message: "Deleted successfully" });
		} catch (err) {
			next(err);
		}
	};
}

module.exports = CartController;
