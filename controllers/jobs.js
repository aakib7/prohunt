const User = require("../models/User");
const Job = require("../models/Job");

// @desc    Fetch all Jobs
// @route   GET /jobs
// @access  Public

exports.getJobs = async (req, res, next) => {
  try {
    // filters and search
    const page = Number(req.query.page) - 1 || 0;
    const limit = Number(req.query.limit) || 5;
    const search = req.query.search || "";
    let sort = req.query.sort || "price";
    let category = req.query.category || "All";
    let priceRange = { $gte: "0" };

    let categories = [
      "Web Development",
      "Content Writing",
      "Mobile App Development",
      "Game Development",
    ];

    category === "All"
      ? (category = [...categories])
      : (categories = req.query.category.split(","));

    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

    let sortBy = {};
    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = "asc";
    }
    if (req.query.price) {
      priceRange = JSON.stringify(req.query.price);
      priceRange = JSON.parse(
        priceRange.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`)
      );
    }
    const jobs = await Job.find({
      title: { $regex: search, $options: "i" },
      price: priceRange,
    })
      .where("category")
      .in([...categories])
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit)
      .populate("owner");
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
    if (!rating || !comment) {
      return res
        .status(400)
        .json({ success: false, message: "Rating and comment is Required" });
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
