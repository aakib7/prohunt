const Job = require("../models/Job");
const Gig = require("../models/Gig");
const User = require("../models/User");
const Order = require("../models/Order");
const Blogs = require("../models/BlogPost");
const Subsecription = require("../models/Subsecription");
const ContactUs = require("../models/ContactUs");
const sendEmail = require("../middlewares/sendEmail");

// total
exports.totalRecord = async (req, res, next) => {
  try {
    // if (req.user.role !== "admin") {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Anauthorized",
    //   });
    // }
    const gigs = await Gig.count();
    const jobs = await Job.count();
    const freelancer = await Gig.find({ role: "freelancer" }).count();
    const employer = await Gig.find({ role: "employer" }).count();
    return res.status(200).json({
      gigs,
      jobs,
      freelancer,
      employer,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// all users
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(404).json({
        success: false,
        message: "No User",
      });
    }
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// user joins in perticular month
exports.getUserJoinMonth = async (req, res, next) => {
  try {
    const users = await User.aggregate([
      {
        $group: {
          _id: { month: { $month: "$joined" }, year: { $year: "$joined" } },
          count: { $sum: 1 },
        },
      },
    ]);
    let data = [];
    users.map((user) => {
      let d = {
        month: user._id.month,
        users: user.count,
      };
      data.push(d);
    });
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
// order details
exports.getOrderDetails = async (req, res, next) => {
  try {
    const orders = await Order.count();
    const blogs = await Blogs.count();
    const ordersCompleted = await Order.find({ isCompleted: true }).count();
    var orderInProgress = orders - ordersCompleted;
    return res.status(200).json({
      orders,
      ordersCompleted,
      orderInProgress,
      blogs,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
// oders month vise
exports.getOrderMonthsVise = async (req, res, next) => {
  try {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
    ]);
    let data = [];
    orders.map((order) => {
      let d = {
        month: order._id.month,
        orders: order.count,
      };
      data.push(d);
    });

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
// subscription
exports.addSubscription = async (req, res, next) => {
  try {
    const subscriptionData = {
      email: req.body.email,
    };
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        message: "Please Enter Email To Get latest News",
      });
    } else {
      const newsuscription = await Subsecription.create(subscriptionData);
      return res.status(200).json({
        success: true,
        subscriptions: newsuscription,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// contacts us
exports.addContactUs = async (req, res, next) => {
  try {
    const contactForm = {
      email: req.body.email,
      name: req.body.name,
      message: req.body.message,
    };
    const { email, name, message } = req.body;
    if ((!email, !name, !message)) {
      return res.status(400).json({
        message: "Please Fill the Data",
      });
    }
    const newContactForm = await ContactUs.create(contactForm);
    return res.status(200).json({
      success: true,
      contacts: newContactForm,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// get Subsecriptons
exports.getSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subsecription.find({});
    return res.status(200).json({
      success: true,
      subscriptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// getcontacts us
exports.getContactUs = async (req, res, next) => {
  try {
    const contact = await ContactUs.find({});
    return res.status(200).json({
      success: true,
      contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// send warning
exports.sendWarning = async (req, res, next) => {
  try {
    let email = req.body.email;
    console.log(email);
    let message =
      "Resently ProHunt received a Complain about you.Please be care full. Thanks!!";
    await sendEmail(email, "Complain Warning", message);
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Block and unblock user
exports.block = async (req, res, next) => {
  try {
    const { id, block } = req.body;
    await User.findByIdAndUpdate(id, {
      $set: { isBlocked: block },
    });
    res.status(200).json({
      success: true,
      message: "Success",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
