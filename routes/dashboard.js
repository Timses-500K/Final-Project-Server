const express = require("express");
const router = express.Router();
const DashboardController = require("../controllers/dashboardController.js");

//ItemApi
router.get("/item", DashboardController.findAllItem);
router.get("/item/false", DashboardController.findAllItemFalse);
router.post("/item", DashboardController.createItemCatSize);
router.put("/item/:itemId", DashboardController.updateItemCatSize);
router.delete("/item/:id", DashboardController.destroyItem);
router.delete("/item/:itemId/size", DashboardController.destroyItemSize);
router.delete('/item/:itemId/category',DashboardController.deleteItemCategory);

//UserApi
router.get("/user", DashboardController.findAllUser)
router.delete("/user/:id", DashboardController.destroyUser);
router.put("/user/:id", DashboardController.updateUser);

//SizeApi
router.get("/sizes", DashboardController.findAllSize);
router.get("/size/:id", DashboardController.findOneSize);
router.post("/size", DashboardController.createSize);
router.put("/size/:id", DashboardController.updateSize);
router.delete("/size/:id", DashboardController.destroySize);

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
