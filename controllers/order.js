const User = require("../models/User");
const Job = require("../models/Job");
const Gig = require("../models/Gig");
const Order = require("../models/Order");

exports.createOrder = async (req, res, next) => {
  try {
    console.log("Fff");
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "title, description is mendatory",
      });
    }
    const newOrderData = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      deliverdTime: req.body.deliverdTime,
      orderType: req.body.orderType,
      owner: req.user._id,
      orderTo: req.body.id,
    };
    const order = await Order.create(newOrderData);

    const orderFromUser = await User.findByIdAndUpdate(req.user._id, {
      $inc: { onGoingProject: 1 },
    });
    orderFromUser.orders.push(order._id);
    await orderFromUser.save();

    const orderToUser = await User.findByIdAndUpdate(req.body.id, {
      $inc: { onGoingProject: 1 },
    });
    orderToUser.orders.push(order._id);
    await orderToUser.save();
    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("owner orderTo");
    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getOrder = async (req, res, next) => {
  try {
    const orders = await Order.findById(req.params.id).populate(
      "owner orderTo"
    );
    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
