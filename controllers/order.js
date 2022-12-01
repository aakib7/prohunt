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
// order of the client who place the order.

exports.getOrderOfOwner = async (req, res, next) => {
  try {
    console.log("gd");
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Enter Status ",
      });
    }
    const orders = await Order.find({
      $and: [{ owner: req.user._id }, { isCompleted: req.body.isCompleted }],
    }).populate("orderTo");
    return res.status(200).json({
      success: true,
      orders,
      totalOrders: orders.length,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getOrderOfFreelancer = async (req, res, next) => {
  try {
    console.log(req.body);
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Enter Status ",
      });
    }
    const orders = await Order.find({
      $and: [{ orderTo: req.body.userId }, { isCompleted: false }],
    }).populate("owner");
    return res.status(200).json({
      success: true,
      orders,
      totalOrders: orders.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// manage project
exports.manageProject = async (req, res, next) => {
  try {
    if (req.user.role !== "freelancer") {
      return res.status(400).json({
        success: false,
        message: "Unauthorized",
      });
    }
    console.log(req.body);
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order Not Found" });
    }
    if (order.orderTo.toString() !== req.user._id.toString()) {
      return res.json({
        success: false,
        message: "Unauthorized",
      });
    }
    const todo = {
      summery: req.body.summery,
      milstoneNumber: req.body.milstoneNumber,
      milstoneWeightage: req.body.milstoneWeightage,
      status: req.body.status,
      dueDate: req.body.status,
    };
    if (order.progress + Number(req.body.milstoneWeightage) > 100) {
      return res.status(400).json({
        success: false,
        message: "Overall Progress Greater than 100%",
      });
    }
    order.todo.push(todo);
    order.progress = order.progress + Number(req.body.milstoneWeightage);
    await order.save();
    return res.send("ok");
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.milstoneStatusChange = async (req, res, next) => {
  try {
    if (req.user.role !== "freelancer") {
      return res.status(400).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const order = await Order.findById(req.params.id);

    if (order.length <= 0) {
      return res
        .status(404)
        .json({ success: false, message: "Order Not Found" });
    }
    if (order.orderTo.toString() !== req.user._id.toString()) {
      return res.json({
        success: false,
        message: "Unauthorized",
      });
    }
    let todo = order.todo;
    for (var key of Object.keys(todo)) {
      if (
        Number(todo[key].milstoneNumber) === Number(req.body.milstoneNumber)
      ) {
        todo[key].status = !todo[key].status;
        break;
      }
    }
    await order.save();
    return res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order.length <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Order Not Found" });
    }
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
