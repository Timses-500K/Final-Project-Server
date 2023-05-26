const { Item, Category, Size, ItemSize, CategoryItem, ItemImage } = require("../models");
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
			const itemById = await Item.findOne({
				where: {
					id,
				},
				attributes: {
					// include: [
					// 	[sequelize.literal(countStock), "countStock"]
					//   ],
					exclude: ["stock"],
				  },
				include: [
					{
						model: Category,
						as: "itemCategory",
						through: { attributes: [] },
						attributes: ["id","categoryName"],
					},
					{
						model: Size,
						as: "itemSize",
						through: { attributes: ["stock"] },
						attributes: ["id","size"],
					},
					{
						model: ItemImage,
						attributes: ["image"]
					}
				],
				// group: ["Item.id", "itemCategory.id", "itemSize.id"], 
			});

			const itemCategories = itemById.itemCategory; // Access the array of associated categories
			const categoryId = itemCategories && itemCategories.length > 0 ? itemCategories[0].id : null;

			if (categoryId) {
			  console.log(categoryId); // Output the category ID
			} else {
			  console.log("No categories found for the item.");
			}
			
			const itemByCategory = await Category.findOne({
				where: {
					id: categoryId,
				},
				limit: 3,
				attributes: ["categoryName"],
				include: [
					{
					  model: CategoryItem,
					  attributes: ["itemId"],
					  include: [
						{
						  model: Item,
						  where:{
							visibility: "True"
						  },
						  order: [["id","ASC"]],
						  attributes: ["itemName", "imageUrl", "price"],
						}
					  ],
					  limit:3,
		  
					},
				  ],
			})

			if (itemById) {
				res.status(200).json({
					productDetails: itemById,
					relatedItems: itemByCategory
				});
			} else {
				throw { name: "ItemNotFound" };
			}
		} catch (err) {
			next(err);
		}
	};
}

module.exports = ProductDetailController;
