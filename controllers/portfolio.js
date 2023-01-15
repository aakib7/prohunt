const Portfolio = require("../models/Portfolio");
const User = require("../models/User");

exports.createPortfolio = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "title, description is mendatory",
      });
    }
    let pics = [];
    if (req.files) {
      req.files.map((file) => {
        pics.push(file.path);
      });
    }
    const newPortfolioData = {
      introduction: req.body.introduction,
      pictures: pics,
      owner: req.user._id,
    };
    const newPortfolio = await Portfolio.create(newPortfolioData);
    const user = await User.findById(req.user._id);
    user.portfolio.push(newPortfolio._id);
    await user.save();
    return res.status(201).json({ success: true, newPortfolio });
  } catch (error) {
    console.log(error.message);
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getSinglePortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.json({ message: "No portfolio" });
    }
    return res.status(200).json({
      success: "success",
      portfolio,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getPortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.find({ owner: req.user._id });
    if (!portfolio) {
      return res.json({ message: "No portfolio" });
    }
    return res.status(200).json({
      success: "success",
      portfolio,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.deletePortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio Not Found",
      });
    }
    if (portfolio.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    await portfolio.remove();
    const user = await User.findById(req.user._id);
    const index = user.portfolio.indexOf(req.params.id);
    user.portfolio.splice(index, 1);
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Portfolio Delete Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.editPortfolio = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.send({ success: false, message: "Enter Somthing" });
    }

    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }
    if (portfolio.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const updatedPortfolioData = {
      introduction: req.body.introduction,
    };
    await Portfolio.findByIdAndUpdate(req.params.id, updatedPortfolioData);

    const updated = await Portfolio.findById(req.params.id);
    return res.send({ success: true, portfolio: updated });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
