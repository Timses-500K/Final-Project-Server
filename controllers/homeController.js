const { Item,Category,CategoryItem } = require("../models");
const sequelize = require("sequelize")


class HomeController {
  static findAll = async (req, res, next) => {
    try {
      const data = await Category.findAll({
        attributes: [
          "id",
          "categoryName",
          [sequelize.literal('(SELECT COUNT(DISTINCT "CategoryItems"."itemId") FROM "CategoryItems" WHERE "CategoryItems"."categoryId" = "Category"."id")'), "categoryItemCount"],
        ],
        distinct: true,// tidak tampilkan duplikat
        order: [["id", "ASC"]],
        include: [
          {
            model: CategoryItem,
            attributes: [
              "categoryId",
              "itemId",
              [sequelize.literal('(SELECT "categoryName" FROM "Categories" WHERE "Categories"."id" = "CategoryItem"."categoryId")'), "categoryName"]
            ],
            include: [
              {
                model: Item,
                where:{
                  visibility: "True"
                },
                order: [["itemId","ASC"]],
                attributes: ["id","itemName", "price", "createdAt", "updatedAt"],
              }
            ],
            limit:3,

          },
        ],
        
      });
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };
}


module.exports = HomeController;
