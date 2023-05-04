const { Admin, Item, ItemSize, Category, Order, User, Size } = require("../models");



class DashboardController {
  //Item

  static findAllItem = async (req, res, next) => {
    try {
      const data = await Item.findAll({
        where: { visibility: "true" },
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

  static findAllItemSize = async (req, res, next) => {
    try {
      const data = await Item.findAll({
        where: { visibility: "true" },
        include: [
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
  

  static findAllItemFalse = async (req, res, next) => {
    try {
      const data = await Item.findAll({
        where: { visibility: "false" },
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
  

  static updateItemCategorySizeById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        itemName,
        description,
        price,
        imageUrl,
        stock,
        color,
        visibility,
        categoryId,
        categoryName,
        sizeId,
        size,
      } = req.body;
      const [updatedItem] = await Item.update(
        {
          itemName,
          description,
          price,
          imageUrl,
          stock,
          color,
          visibility,
          categoryId,
          sizeId,
        },
        {
          where: { id },
          returning: true,
        }
      );
  
      const [updatedCategory] = await Category.update(
        {
          categoryName,
        },
        {
          where: { id: categoryId },
          returning: true,
        }
      );
  
      const [updatedSize] = await Size.update(
        {
          size,
        },
        {
          where: { id: sizeId },
          returning: true,
        }
      );
  
      res.status(200).json({
        updatedItem,
        updatedCategory,
        updatedSize,
      });
    } catch (err) {
      next(err);
    }
  };
  

  static createItem = async (req, res, next) => {
    try {
      const {
        itemName,
        description,
        price,
        imageUrl,
        stock,
        color,
        visibility,
        categoryName,
        size,
      } = req.body;

      const newItem = await Item.create({
        itemName,
        description,
        price,
        imageUrl,
        stock,
        color,
        visibility,
      });

      const newCategory = await Category.create({
        categoryName,
      });

      const newSize = await Size.create({
        size,
      });

      await newItem.setItemCategory(newCategory);
      await newItem.setItemSize(newSize);

      res.status(201).json({
        newItem,
        newCategory,
        newSize,
      });
    } catch (err) {
      next(err);
    }
  };

  static destroyItem = async (req, res, next) => {
    try {
      const { id } = req.params;

      const data = await Item.update(
        {
          visibility: "false",
        },
        {
          where: {
            id,
          },
        }
      );

      if (data[0] === 1) {
        res.status(200).json({
          message: "Delete successfully",
        });
      } else {
        throw { name: "ErrorNotFound" };
      }
    } catch (err) {
      next(err);
    }
  };

  static destroyItemSize = async (req, res, next) => {
    try {
      const { id } = req.params;

      const data = await ItemSize.destroy({
        where: {
          id,
        },
      });

      if (data === 1) {
        res.status(200).json({
          message: "Delete successfully",
        });
      } else {
        throw { name: "ErrorNotFound" };
      }
    } catch (err) {
      next(err);
    }
  };

  

  //User
  static updateUser = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const user = await User.findOne({ where: { id } });
      if (!user) {
        throw { name: "ErrorNotFound", message: "User not found" };
      }
  
      user.visibility = true;
  
      await user.save();
  
      res.status(200).json({
        message: "User update successfully",
      });
    } catch (err) {
      next(err);
    }
  };



  static destroyUser = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const user = await User.findOne({ where: { id } });
      if (!user) {
        throw { name: "ErrorNotFound", message: "User not found" };
      }
  
      user.visibility = false;
  
      await user.save();
  
      res.status(200).json({
        message: "User deleted successfully",
      });
    } catch (err) {
      next(err);
    }
  };
  

 

  //Category
  static findAllCategory = async (req, res, next) => {
    try {
      const data = await Category.findAll({
        include: [
          {
            model: Item,
            as: "categoryItem",
            through: { attributes: [] },
            attributes: ["itemName"],
          },
        ],
      });

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };

  static findAllCategoryItem = async (req, res, next) => {
    try {
      const data = await Category.findAll({
        include: [
          {
            model: Item,
            as: "categoryItem",
            through: { attributes: [] },
            attributes: ["itemName"],
          },
        ],
      });

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };

  static createCategory = async (req, res, next) => {
    try {
      const { categoryName } = req.body;

      const data = await Category.create({
        categoryName,
      });

      res.status(201).json(data);
    } catch (err) {
      next(err);
    }
  };

  static updateCategory = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { categoryName } = req.body;

      const data = await Category.update(
        {
          categoryName,
        },
        {
          where: {
            id,
          },
        }
      );

      if (data[0] === 1) {
        res.status(200).json({
          message: "Item updated successfully",
        });
      } else {
        throw { name: "ErrorNotFound" };
      }
    } catch (err) {
      next(err);
    }
  };

  static destroyCategory = async (req, res, next) => {
    try {
      const { id } = req.params;

      const data = await Category.destroy({
        where: {
          id,
        },
      });

      if (data === 1) {
        res.status(200).json({
          message: "Delete successfully",
        });
      } else {
        throw { name: "ErrorNotFound" };
      }
    } catch (err) {
      next(err);
    }
  };

  //OrderApi
  static findAllOrder = async (req, res, next) => {
    try {
      const data = await Order.findAll({
        include: [
          {
            model: Item,
            as: "orderItem",
            include: [
              {
                model: Category,
                as: "itemCategory",
              },
              {
                model: Size,
                as: "itemSize",
              },
            ],
          },
        ],
      });

      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };

  static updateOrder = async (req, res, next) => {
    try {
      const { id } = req.params;

      const data = await Order.update(
        {
          status: "on progress",
        },
        {
          where: {
            id,
          },
        }
      );

      if (data[0] === 1) {
        res.status(200).json({
          message: "Order updated successfully",
        });
      } else {
        throw { name: "ErrorNotFound" };
      }
    } catch (err) {
      next(err);
    }
  };
};



module.exports = DashboardController;
