// @desc    Fetch all gigs
// @route   GET /gigs
// @access  Public

exports.getJobs = async (req, res, next) => {
  try {
    return res.status(200).send("helo");
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
