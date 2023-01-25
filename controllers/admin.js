const Job = require("../models/Job");
const Gig = require("../models/Gig");
const User = require("../models/User");

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
//
exports.getUserJoinMonth = async (req, res, next) => {
  try {
    var today = new Date();
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
