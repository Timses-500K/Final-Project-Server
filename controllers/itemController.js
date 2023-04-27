const { Item, Category, Size } = require("../models");
// const { Op } = require("sequelize");

class ItemController {
  static findAll = async (req, res, next) => {
    try {
      // const {categoryId} = req.query;
      const data = await Item.findAll({
        include: [
          {
            model: Category,
            as: "itemCategory",
            through: { attributes: [] },
            attributes: ["categoryName"],
            // where:{
            //   id: +id,
            // }
          },
          {
            model: Size,
            as: "itemSize",
            through: { attributes: [] },
            attributes: ["size"]
          }
        ]
        // include: {
        //   model: Category, 
        //   as: "itemCategory"
        // }
      });
      res.status(200).json(data);
      // console.log(data);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = ItemController;
