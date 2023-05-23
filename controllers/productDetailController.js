const { Item, Category, Size, ItemSize } = require("../models");
const sequelize = require("sequelize")

class ProductDetailController {
	static findById = async (req, res, next) => {
		const { id } = req.params;

		try {
			const stock = await ItemSize.findAll({
				where: {
				  itemId: id,				  
				},
			  });
		  
			const countStock = stock.length;
			const data = await Item.findOne({
				where: {
					id,
				},
				attributes: {
					include: [
						[sequelize.literal(countStock), "countStock"]
					  ],
					exclude: ["stock"],
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
						distinct: true,
						attributes: ["size",
						[sequelize.fn("COUNT", sequelize.col("itemSize.id")), "itemSizeCount"],
						],
						
					},
				],
				group: ["Item.id", "itemCategory.id", "itemSize.id"], 
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
