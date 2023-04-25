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
            // where:{
            //   id: +categoryId,
            // }
          },
          {
            model: Size,
            as: "itemSize"
          }
        ]
        // include: {
        //   model: Category, 
        //   as: "itemCategory"
        // }
      });
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = ItemController;
