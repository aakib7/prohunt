const Category = require("../models/Category");
const SubCategory = require("../models/SubCategory");

exports.createCategory = async (req, res, next) => {
  try {
    const newCatData = {
      name: req.body.name,
      imageUrl: req.body.imageUrl,
    };
    const newCat = await Category.create(newCatData);
    return res.status(200).json({
      success: true,
      category: newCat,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.createSubCategory = async (req, res, next) => {
  try {
    const newSubCatData = {
      name: req.body.name,
      imageUrl: req.body.imageUrl,
    };
    const newCat = await SubCategory.create(newSubCatData);
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404).json({
        success: false,
        message: "category not found",
      });
    }
    category.subCategories.push(newCat._id);
    await category.save();
    return res.status(201).json({ success: true, newCat });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getCategories = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) - 1 || 0;
    const limit = Number(req.query.limit) || 10;
    const categories = await Category.find({
      name: { $regex: search, $options: "i" },
    })
      .skip(page * limit)
      .limit(limit)
      .populate("subCategories");
    const Count = await Category.count();
    return res.status(200).json({
      success: true,
      categories,
      total: Count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.categoryId).populate(
      "subCategories"
    );
    // console.log(categories[0].name);
    return res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
