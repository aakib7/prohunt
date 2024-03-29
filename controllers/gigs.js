const User = require("../models/User");
const Gig = require("../models/Gig");
const Category = require("../models/Category");

// @desc    Fetch all gigs
// @route   GET /gigs
// @access  Public
exports.getGigs = async (req, res) => {
  try {
    // filters and search
    const page = Number(req.query.page) - 1 || 0;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";
    let sort = req.query.sort || "rating";
    let category = req.query.category || "All";
    let priceRange = { $gte: "0" };

    const categoriesObj = await Category.find({});
    let categories = [];
    categoriesObj.map((cat) => {
      categories.push(cat.name);
    });

    category === "All"
      ? (category = [...categories])
      : (categories = req.query.category.split(","));

    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

    let sortBy = {};
    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = -1;
    }

    //  req.query.price; // in obj like { gt: '1200', lt: '2000' }
    // console.log(priceRange);
    // price gt and lt -> add $ for mongo
    if (req.query.price) {
      priceRange = JSON.stringify(req.query.price);
      priceRange = JSON.parse(
        priceRange.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`)
      );
    }
    const Gigs = await Gig.find({
      title: { $regex: search, $options: "i" },
      price: priceRange,
    })
      .where("category")
      .in([...categories])
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit)
      .populate("owner");
    const gigCount = await Gig.count();

    return res.status(201).json({
      success: true,
      Gigs: Gigs,
      total: gigCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createGig = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Attach picture",
      });
    }
    const gig = await Gig.find({ owner: req.user._id });
    if (gig.length == 5) {
      return res.status(400).json({
        success: false,
        message: "You already have 5 gig. only 5 allowed at a time",
      });
    }
    if (!req.body.gigTitle && !req.body.gigPrice && !req.body.subCategories) {
      return res.status(400).json({
        success: false,
        message: "title, price and category is mendatory",
      });
    }
    if (Number(req.body.gigPrice) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Gig Price Must be Greater than 0",
      });
    }
    const categories = req.body.subCategories.split(",");

    const newGigData = {
      title: req.body.gigTitle,
      description: req.body.description,
      price: req.body.gigPrice,
      category: categories,
      deliveredTime: req.body.Deliver,
      image: {
        public_id: req.file.filename,
        url: req.file.path,
      },
      owner: req.user._id,
    };
    const newGig = await Gig.create(newGigData);

    const user = await User.findById(req.user._id);
    user.gigs.push(newGig._id);
    await user.save();

    return res.status(201).json({ success: true, newGig });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.singleGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id).populate("owner");
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not Found",
      });
    }
    return res.status(201).json({ success: true, gig });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.totalGigs = async (req, res) => {
  const gig = await Gig.find({ owner: req.user._id });
  // console.log(gig)
  res.send(`length is ${gig.length}`);
};

// @desc    Delete gig
// @route   delete /gigs//deletegig/:id
// @access  Private
exports.deleteGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) return res.status(404).send("Gig Not Found");

    if (gig.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    await gig.remove();
    // after removing the gig from gigs we have to delete gig from user's posts list
    const user = await User.findById(req.user._id);
    const index = user.gigs.indexOf(req.params.id);
    user.gigs.splice(index, 1);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Gig Delete Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new review
// @route   POST /gigs/:id/reviews
// @access  Private

exports.createReview = async (req, res, next) => {
  try {
    let alreadyReviewed = false;
    let owner = false;
    const { rating, comment } = req.body;
    if (!rating || !comment) {
      return res
        .status(400)
        .json({ success: false, message: "Comment and Rating is Required" });
    }
    const gig = await Gig.findById(req.params.id);

    if (!gig) {
      return res.status(404).json({ success: false, message: "Gig Not Found" });
    }
    if (gig.owner.toString() === req.user._id.toString()) {
      return res.json({
        success: false,
        message: "You Can't Review your Own Gig",
      });
    }

    if (gig) {
      alreadyReviewed = gig.reviews.find(
        (review) => review.user.toString() === req.user._id.toString()
      );
    }
    if (alreadyReviewed) {
      return res.json({ success: false, message: "Already Reviewed" });
    }
    const review = {
      name: req.user.firstName + " " + req.user.lastName,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    gig.reviews.push(review);
    gig.numReviews = gig.reviews.length;
    gig.rating =
      gig.reviews.reduce((acc, item) => item.rating + acc, 0) /
      gig.reviews.length;

    await gig.save();
    res.status(201).json({ success: true, message: "Review added" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Like and dislike Giga
// @route   Get /gig/:id/likes
// @access  private
exports.likeUnlikeGig = async function (req, res, next) {
  try {
    const gig = await Gig.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!gig) {
      return res.status(404).json({ success: true, message: "Gig Not Found" });
    }

    // if already like so dislike the gig
    if (gig.likes.includes(req.user._id)) {
      // find that user index in the array of likes
      const index = gig.likes.indexOf(req.user._id);
      // find that like in that users likes
      const user_like_index = user.likes.gigs.indexOf(req.params.id);

      // delete that id from likes array
      gig.likes.splice(index, 1);
      user.likes.gigs.splice(user_like_index, 1);

      await gig.save();
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Post Unliked",
      });
    } else {
      gig.likes.push(req.user._id);
      user.likes.gigs.push(req.params.id);
      await gig.save();
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Post Liked",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateGig = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.send({ success: false, message: "Enter Somthing" });
    }
    if (Number(req.gigPrice) <= 0) {
      return res.status(404).json({
        success: false,
        message: "Price Must be greater than 0",
      });
    }
    const gig = await Gig.findById(req.params.id);
    if (!gig) {
      return res.status(404).json({
        success: false,
        message: "Gig not found",
      });
    }
    if (gig.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const categories = req.body.subCategories.split(",");
    const updatedGigData = {
      title: req.body.gigTitle,
      description: req.body.description,
      price: req.body.gigPrice,
      category: categories,
      deliveredTime: req.body.Deliver,
    };
    await Gig.findByIdAndUpdate(req.params.id, updatedGigData);
    if (req.file) {
      let g = await Gig.findById(req.params.id);
      g.image.public_id = req.file.filename;
      g.image.url = req.file.path;
      await g.save();
    }
    const updated = await Gig.findById(req.params.id);
    return res.send({ success: true, gig: updated });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
