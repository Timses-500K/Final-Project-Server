const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const { Admin, Item, ItemSize, Category, Order, User, Size, CategoryItem } = require("../models");



class DashboardController {
  //Login Admin
  static loginAdmin = async (req, res, next) => {
    const { username, password } = req.body;

    try {
      // Find the admin record in the database
      const admin = await Admin.findOne({ where: { username } });
  
      // If the admin doesn't exist, return an error
      if (!admin) {
        return res.status(401).json({ error: "Admin Not found" });
      }
  
      // Compare the provided password with the hashed password in the database
      const passwordMatch = await bcrypt.compare(password, admin.password);
  
      if (!passwordMatch) {
        throw { name: "WrongPassword" };
      }
      // return res.status(200).json({ message: "Login successful" });
      const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET);
      res.status(201).json({ token, message: "Login Successfully" });
    } catch (err) {
      next(err)
    }
  };
  
  //Item
  static findAllItem = async (req, res, next) => {
    try {
      const data = await Item.findAll({
        where: {
          visibility: {
            [Op.like]: `%True%`,
          },
         },
        order: [["id", "DESC"]],
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
  
  static createItemCatSize = async (req, res, next) => {
    try {
      const autoFillUpdatedAt = new Date();
      const autoFillCreateddAt = new Date();
      const {
        itemName,
        description,
        price,
        imageUrl,
        // stock,
        color,
        categoryName,
        sizes,
      } = req.body;

      const category = await Category.findOne({
        where: {
          categoryName,
        },
      });

      if (!category) {
        throw { name: "CategoryNotFound" };
      }

      const newItem = await Item.create({
        itemName,
        description,
        price,
        imageUrl,
        color,
        createdAt:autoFillCreateddAt,
        updatedAt:autoFillUpdatedAt,
      });

      const newCategoryItem = await CategoryItem.create({
        categoryId: category.id,
        itemId: newItem.id,
      });

      const newItemSizes = [];
      for (const size of sizes) {
        const newItemSize = await ItemSize.create({
          itemId: newItem.id,
          sizeId: size,
        });
        newItemSizes.push(newItemSize);
      }

      const stock = await ItemSize.findAll({
        where: {
          itemId: newItem.id,
          sizeId: sizes,
        },
      });
  
      const countStock = stock.length;
  
      newItem.stock = countStock;
      await newItem.save();

      res.status(201).json({
        newItem,
        newCategoryItem,
        newItemSizes,
      });
    } catch (err) {
      next(err);
    }
  };

  static addSizeItem = async (req, res, next) => {
    try {
      const { itemId, sizes } = req.body;

      // Find the item by itemId
      const item = await Item.findOne({ where: { id: itemId } });
  
      if (!item) {
        throw { name: "ItemNotFound" };
      }
  
      const newItemSizes = [];
  
      for (const size of sizes) {
        // Create item size record
        const newItemSize = await ItemSize.create({
          itemId,
          sizeId: size,
        });
  
        newItemSizes.push(newItemSize);
      }
  
      res.status(201).json({
        item,
        newItemSizes,
      });
    } catch (err) {
      next(err);
    }
  };

  static updateItemCatSize = async (req, res, next) => {
    try {
      const autoFillUpdatedAt = new Date();
      const {
        itemName,
        description,
        price,
        imageUrl,
        // stock,
        color,
        visibility,
        categoryName,
        sizes,
      } = req.body;

      // Find the item to be updated
      const item = await Item.findByPk(req.params.itemId);
      if (!item) {
        throw { name: "ItemNotFound" };
      }

      // Update the item's properties
      item.itemName = itemName || item.itemName;
      item.description = description || item.description;
      item.price = price || item.price;
      item.imageUrl = imageUrl || item.imageUrl;
      // item.stock = stock || item.stock;
      item.color = color || item.color;
      item.visibility = visibility || item.visibility;
      item.updatedAt = autoFillUpdatedAt;
      
      await CategoryItem.destroy({
        where: {
          itemId: item.id,
        },
      })
      const category = await Category.findOne({
        where: {
          categoryName,
        },
      });

      const newCategoryItem = await CategoryItem.create({
        itemId: item.id,
        categoryId: category.id
      })

      // Update the item's sizes
      await ItemSize.destroy({
        where: {
          itemId: item.id,
        },
      });

      const newItemSizes = [];
      for (const size of sizes) {
        const newItemSize = await ItemSize.create({
          itemId: item.id,
          sizeId: size,
        });
        newItemSizes.push(newItemSize);
      }

      const stock = await ItemSize.findAll({
        where: {
          itemId: item.id,
          sizeId: sizes,
        },
      });
  
      const countStock = stock.length;
  
      item.stock = countStock;

      // Save the updated item
      await item.save();

      res.status(200).json({
        item,
        newCategoryItem,
        newItemSizes,
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
          message: `Deleted successfully`,
          
        });
      } else {
        throw { name: "ItemNotFound" };
      }
    } catch (err) {
      next(err);
    }
  };

  static destroyItemSize = async (req, res, next) => {
    try {
      const { itemId } = req.params;
      const item = await Item.findByPk(itemId);

      if (!item) {
        throw { name: "ItemNotFound" };
      }

      await ItemSize.destroy({
        where: {
          itemId
        },
      });
      
      res.status(200).json({
        message: `Item Size Deleted Successfully`,
      });
    } catch (err) {
      next(err);
    }
  };

  static deleteItemCategory = async (req, res, next) => {
    try {
      const { itemId } = req.params;
      const item = await Item.findByPk(itemId);

      if (!item) {
        throw { name: "ItemNotFound" };
      }

      await CategoryItem.destroy({
        where: {
          itemId,
        },
      });

      res.status(200).json({
        message: `Category Item Deleted Successfully`,
      });
    } catch (err) {
      next(err);
    }
  };


  //User
  static findAllUser = async (req, res, next) => {
    try {
      const data = await User.findAll({
        where: { visibility: "True" },
        order: [["id", "ASC"]],
      });
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };

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
 
  //Size
  static findAllSize = async (req, res, next) => {
    try {
      const data = await Size.findAll({
        order: [["size", "ASC"]],
      });
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };

  static findOneSize = async (req, res, next) => {
    try {
      const { id } = req.params;
      const data = await Size.findOne({
        where: { id },
      });
      if(!data){
        throw { name: "SizeNotFound" };
      }
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };

  static createSize = async (req, res, next) => {
    try {
      const { size } = req.body;
      
      const existingSize = await Size.findOne({
        where: {
            size
        }
      });
      if (existingSize) {
        return res.status(400).json({ error: "Size already exists" });
      }
      const newSize = await Category.create({
        size,
      });

      res.status(201).json({newSize});
    } catch (err) {
      next(err);
    }
  };
  
  static updateSize = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { size } = req.body;

      const existingSize = await Size.findOne({ where: { size } });

      if (existingSize && existingSize.id !== parseInt(id)) {
        return res.status(400).json({ error: "Size already exists" });
      }

      const updateSize = await Size.update(
        {
          size,
        },
        {
          where: {
            id,
          },
        }
      );

      if (updateSize[0] === 1) {
        res.status(200).json({
          message: "Size Updated successfully",
        });
      } else {
        throw { name: "SizeNotFound" };
      }
    } catch (err) {
      next(err);
    }
  };

  static destroySize = async (req, res, next) => {
    try {
      const { id } = req.params;

      const data = await Size.destroy({
        where: {
          id,
        },
      });

      if (data === 1) {
        res.status(200).json({
          message: "Deleted successfully",
        });
      } else {
        throw { name: "SizeNotFound" };
      }
    } catch (err) {
      next(err);
    }
  };
  
  //Category
  static findAllCategory = async (req, res, next) => {
    try {
      const data = await Category.findAll({
        order: [["categoryName","ASC"]],
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
        order:[["id","ASC"]],
        include: [
          {
            model: Item,
            as: "categoryItem",
            through: { attributes: [] },
            attributes: ["itemName"],
            where:{
              visibility: "True"
            }
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

      const existingCategory = await Category.findOne({
        where: {
            categoryName
        }
      });
      if (existingCategory) {
        return res.status(400).json({ error: "Category already exists" });
      }


      const newCategory = await Category.create({
        categoryName,
      });

      res.status(201).json({newCategory});
    } catch (err) {
      next(err);
    }
  };

  static updateCategory = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { categoryName } = req.body;

      const updateCategory = await Category.update(
        {
          categoryName,
        },
        {
          where: {
            id,
          },
        }
      );

      if (updateCategory[0] === 1) {
        res.status(200).json({
          message: "Updated successfully",
        });
      } else {
        throw { name: "CategoryNotFound" };
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
          message: "Deleted successfully",
        });
      } else {
        throw { name: "CategoryNotFound" };
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
          status: "Being Processed",
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
