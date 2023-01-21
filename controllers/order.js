const User = require("../models/User");
const Job = require("../models/Job");
const Gig = require("../models/Gig");
const Order = require("../models/Order");

exports.createOrder = async (req, res, next) => {
  try {
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

    // customer order handling
    const orderFromUser = await User.findByIdAndUpdate(req.user._id, {
      $inc: { onGoingProject: 1 },
    });
    orderFromUser.orders.push(order._id);
    await orderFromUser.save();

    // freelancer order handling
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
    // console.log("gd");
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

// get freelancer incomplete orders and complete
exports.getOrderOfFreelancer = async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "Enter Status",
      });
    }
    const orders = await Order.find({
      $and: [
        { orderTo: req.body.userId },
        { isCompleted: req.body.isCompleted },
      ],
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
    // console.log(req.body);
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
exports.completeOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order.orderTo.toString() !== req.user._id.toString()) {
      return res.json({
        success: false,
        message: "Unauthorized",
      });
    }
    await Order.findByIdAndUpdate(req.params.id, {
      isCompleted: true,
    });
    // freelancer order handling
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { onGoingProject: -1 },
    });
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { completedProject: 1 },
    });
    //customer order completion handling
    await User.findByIdAndUpdate(order.owner, {
      $inc: { completedProject: 1 },
    });
    await User.findByIdAndUpdate(order.owner, {
      $inc: { onGoingProject: -1 },
    });

    return res.status(200).json({
      success: true,
      message: "complete order success",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// owner
exports.getFreelancerTeamOrder = async (req, res, next) => {
  try {
    const orders = await Order.find({ owner: req.user._id }).populate(
      "orderTo"
    );
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
// order Rating
exports.rateOrder = async (req, res, next) => {
  try {
    let { rating } = req.body;
    const order = await Order.findById(req.params.id);
    order.rating = rating;
    order.isRated = true;
    await order.save();

    const user = await User.findById(order.orderTo);

    const review = {
      rating: Number(rating),
    };
    user.reviews.push(review);
    user.numReviews = user.reviews.length;
    user.rating =
      user.reviews.reduce((acc, item) => item.rating + acc, 0) /
      user.reviews.length;
    await user.save();
    return res.status(200).json({
      success: true,
      messsage: "Review Added",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
