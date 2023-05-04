const express = require("express");
const router = express.Router();
const DashboardController = require("../controllers/dashboardController.js");

//ItemApi
router.get("/item", DashboardController.findAllItem);
router.get("/item/false", DashboardController.findAllItemFalse);
router.post("/item", DashboardController.createItem);
router.delete("/item/:id", DashboardController.destroyItem);
router.put("/item/:id", DashboardController.updateItemCategorySizeById);
router.get("/item/size", DashboardController.findAllItemSize);
router.delete("/item/size/:id", DashboardController.destroyItemSize);

//UserApi
router.delete("/user/:id", DashboardController.destroyUser);
router.put("/user/:id", DashboardController.updateUser);

//CategoryApi
router.get("/category", DashboardController.findAllCategory);
router.post("/category", DashboardController.createCategory);
router.put("/category/:id", DashboardController.updateCategory);
router.delete("/category/:id", DashboardController.destroyCategory);
router.get("/category/item", DashboardController.findAllCategoryItem);


//OrderApi
router.get("/order", DashboardController.findAllOrder);
router.put("/order/:id", DashboardController.updateOrder);



module.exports = router;
