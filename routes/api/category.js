const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  createSubCategory,
  getCategory,
} = require("../../controllers/category");
const { isAuthenticated } = require("../../middlewares/auth");

router.post("/create", isAuthenticated, createCategory);
router.post("/create/subcategory/:id", isAuthenticated, createSubCategory);
router.get("/", getCategories);
router.get("/:categoryId", getCategory);

module.exports = router;
