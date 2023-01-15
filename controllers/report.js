const User = require("../models/User");
const Order = require("../models/Order");
const sendEmail = require("../middlewares/sendEmail");

exports.generateReport = async (req, res, next) => {
  try {
    const order = await Order.find({
      $or: [{ owner: req.user._id }, { orderTo: req.user._id }],
    });
    const user = await User.findById(req.user._id);

    let total_gigs = user.gigs.lehgth;
    let name = user.firstName + " " + user.lastName;
    let email = user.email;
    let joined = user.joined;
    let total_jobs = user.jobs.lehgth;
    let total_blogs = user.blogs.length;
    let completed_project = user.completedProject;
    let progress_project = user.onGoingProject;
    let role = user.role;
    let length = order.length;
    let total = 0;
    order?.map((ord) => {
      total = total + ord.price;
    });

    let message = `
    Hi <strong>${name},</strong><br><br>This is the report of your activity on Prohunt till date.You have joined ProHunt platform on <strong>${joined}</strong> as <strong>${role}.</strong><br>
    You have generated <strong>${total}$</strong> from ${length} projects.<br>
    Currently you are having <strong>${progress_project}</strong> project(s) in working queue.
    `;
    await sendEmail(user.email, "ProHunt Report", message);

    return res.json({
      success: true,
      message: "Email send successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
