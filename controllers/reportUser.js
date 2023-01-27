const ReportUser = require("../models/ReportedUser");
const User = require("../models/User");

exports.reportUser = async (req, res, next) => {
  try {
    let reportedBy = req.user._id;
    let { reportedUser, message } = req.body;
    await ReportUser.create({ reportedBy, reportedUser, message });
    await User.findByIdAndUpdate(reportedUser, {
      $inc: { reports: 1 },
    });
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReportUser = async (req, res, next) => {
  try {
    const reports = await ReportUser.find({});
    return res.status(200).json({
      success: true,
      reports,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
