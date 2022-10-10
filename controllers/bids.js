const User = require("../models/User");
const Job = require("../models/Job");

// @desc    Bid on a Job
// @route   POST /bid/:id
// @access  Private

exports.createBid = async (req, res, next) => {
  try {
    let alreadyBid = false;
    const description = req.body.description;
    if (!description) {
      return res
        .status(400)
        .json({ success: false, message: "Description is reqruired" });
    }
    const job = await Job.findById(req.params.id);
    if (!Job) {
      return res.status(404).json({ success: false, message: "Job Not Found" });
    }
    if (job.owner.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "You Can't Bid on your Own Job!" });
    }
    if (job) {
      alreadyBid = job.bids.find(
        (bid) => bid.owner.toString() === req.user._id.toString()
      );
    }
    if (alreadyBid) {
      return res
        .status(400)
        .json({ success: false, message: "You can only bid once on a job!!" });
    }
    const bid = {
      description,
      owner: req.user._id,
    };
    job.bids.push(bid);
    await job.save();
    res
      .status(201)
      .json({ success: true, message: "Your bid Added successfully!!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get All Bids on a Job
// @route   Get /bid/:id/    -> id of job
// @access  Public

exports.getBids = async (req, res, next) => {
  try {
    // const job = await Job.findById(req.params.id).populate("owner");

    // nested populate
    const job = await Job.findById(req.params.id).populate({
      path: "bids.owner",
    });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      bids: job.bids,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    delete Bid
// @route   delete /bid/:id/
// @access  Private

// Todo  for delete and update
// first go to that job from which u want to delete thw bid
// then delete that bid from it

exports.deleteBid = async (req, res, next) => {
  try {
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
