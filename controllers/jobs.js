const User = require("../models/User");
const Job = require("../models/Job");

// @desc    Fetch all Jobs
// @route   GET /jobs
// @access  Public

exports.getJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({});
    if (!jobs) {
      res.status(404).json({
        success: false,
        message: "No Jobs Found",
      });
    }
    return res.status(200).json({
      success: true,
      Jobs: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create New job
// @route   Post /createjob
// @access  private
exports.createJob = async (req, res, next) => {
  try {
    const job = await Job.find({ owner: req.user._id });
    if (job.length == 5) {
      return res.status(400).json({
        success: false,
        message: "You already have 5 Job. Only 5 allowed at a time",
      });
    }
    if (
      !req.body.title &&
      !req.body.price &&
      !req.body.category &&
      !req.body.description
    ) {
      return res.status(400).json({
        success: false,
        message: "title, price and category is mendatory",
      });
    }

    const newJobData = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,

      image: {
        public_id: "req.body.image",
        url: "req.body.url",
      },
      owner: req.user._id,
    };
    const newJob = await Job.create(newJobData);

    const user = await User.findById(req.user._id);
    user.jobs.push(newJob._id);
    await user.save();

    return res.status(201).json({ success: true, job: newJob });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Fetch a single job with particular id
// @route   get jobs/:id
// @access  public

exports.singleJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete job with id
// @route   delete jobs/deletejob/:id
// @access  private

exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job Not Found",
      });
    }
    if (job.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    await job.remove();

    const user = await User.findById(req.user._id);
    const index = user.jobs.indexOf(req.params.id);
    user.jobs.splice(index, 1);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Job Delete Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new review
// @route   POST /jobs/:id/reviews
// @access  Private

exports.createReview = async (req, res, next) => {
  try {
    let alreadyReviewed = false;
    const { rating, comment } = req.body;
    if (!rating && !comment) {
      return res
        .status(400)
        .json({ success: false, message: "Rating and comment is required" });
    }
    const job = await Job.findById(req.params.id);
    if (!Job) {
      return res.status(404).json({ success: false, message: "Job Not Found" });
    }
    if (job.owner.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ success: false, message: "You Can't Review your Own Job" });
    }
    if (job) {
      alreadyReviewed = job.reviews.find(
        (review) => review.user.toString() === req.user._id.toString()
      );
    }
    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ success: false, message: "Already Reviewed" });
    }
    const review = {
      name: req.user.firstName + " " + req.user.lastName,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };
    job.reviews.push(review);
    job.numReviews = job.reviews.length;
    job.rating =
      job.reviews.reduce((acc, item) => item.rating + acc, 0) /
      job.reviews.length;
    await job.save();
    res.status(201).json({ success: true, message: "Review added" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
