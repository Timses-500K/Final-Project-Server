const { Item, Category, Size, CategoryItem } = require("../models");
const sequelize = require("sequelize")

class ProductController {
	static findAllItem = async (req, res, next) => {
		try {
			const data = await Item.findAll({
				where: {
					visibility: "True",
				},
				order: [["id", "ASC"]],
				include: [
					{
						model: Category,
						as: "itemCategory",
						through: { attributes: [] },
						attributes: ["categoryName"],
					},
					// {
					// 	model: Size,
					// 	as: "itemSize",
					// 	through: { attributes: [] },
					// 	attributes: ["size"],
					// },
				],
			});
			res.status(200).json(data);
		} catch (err) {
			next(err);
		}
	};

	static findAllByCat = async (req, res, next) => {
		try {
			const { id } = req.params;
			const data = await Category.findOne({
				where: {
					id,
				},
				attributes: [
					"id",
					"categoryName",
					[sequelize.literal('(SELECT COUNT(DISTINCT "CategoryItems"."itemId") FROM "CategoryItems" WHERE "CategoryItems"."categoryId" = "Category"."id")'), "categoryItemCount"],
				],
				include: [
					{
					  model: CategoryItem,
					  attributes: [
						"categoryId",
						"itemId",
					  ],
					  include: [
						{
						  model: Item,
						  where:{
							visibility: "True"
						  },
						  order: [["id","ASC"]],
						  attributes: ["id","itemName", "imageUrl", "price", "createdAt", "updatedAt"],
						}
					  ],
					//   limit:5,
		  
					},
				  ],
			});

			if (data) {
				res.status(200).json(data);
			} else {
				throw { name: "CategoryNotFound" };
			}
		} catch (err) {
			next(err);
		}
	};
}

module.exports = ProductController;
