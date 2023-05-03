const { Item, Category, Size } = require("../models");

class ProductController {
	static findAllItem = async (req, res, next) => {
		try {
			const data = await Item.findAll({
				where: {
					visibility: "True",
				},
				include: [
					{
						model: Category,
						as: "itemCategory",
						through: { attributes: [] },
						attributes: ["categoryName"],
					},
					{
						model: Size,
						as: "itemSize",
						through: { attributes: [] },
						attributes: ["size"],
					},
				],
			});
			res.status(200).json(data);
		} catch (err) {
			next(err);
		}
	};

	static findAllByCat = async (req, res, next) => {
		try {
			const { categoryName } = req.params;
			const data = await Category.findOne({
				where: {
					categoryName,
				},
				include: [
					{
						model: Item,
						as: "categoryItem",
						through: { attributes: [] },
						attributes: ["itemName", "price", "imageUrl"],
					},
				],
			});

			if (data) {
				res.status(200).json(data);
			} else {
				throw { name: "ErrorNotFound" };
			}
		} catch (err) {
			next(err);
		}
	};
}

module.exports = ProductController;
