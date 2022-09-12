const User = require("../models/User");
const Gig = require("../models/Gig");

exports.gigs = async (req, res) => {
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
      .limit(limit);
    return res.status(201).json({
      success: true,
      Gigs: Gigs,
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
    const gig = await Gig.find({ owner: req.user._id });
    if (gig.length == 5) {
      return res.status(400).json({
        success: false,
        message: "You already have 5 gig. only 5 allowed at a time",
      });
    }
    if (!req.body.title && !req.body.price && !req.body.category) {
      return res.status(400).json({
        success: false,
        message: "title, price and category is mendatory",
      });
    }

    const newGigData = {
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
    const newGig = await Gig.create(newGigData);

    const user = await User.findById(req.user._id);
    user.gigs.push(newGig._id);
    await user.save();

    return res.status(201).json({ success: true, newGig });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

exports.singleGig = async (req, res) => {
  try {
    const gig = await Gig.findById(req.params.id);
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
    // after removing the post from post we have to delete post from user's posts list
    const user = await User.findById(req.user._id);
    const index = user.gigs.indexOf(req.params.id);
    user.gigs.splice(index, 1);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Post Delete Successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
