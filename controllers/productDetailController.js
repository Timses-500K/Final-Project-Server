const { Item, Category, Size } = require("../models");

class ProductDetailController {
	static findById = async (req, res, next) => {
		const { id } = req.params;

		try {
			const data = await Item.findOne({
				where: {
					id,
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

			if (data) {
				res.status(200).json(data);
			} else {
				throw { name: "ItemNotFound" };
			}
		} catch (err) {
			next(err);
		}
	};
}

module.exports = ProductDetailController;
