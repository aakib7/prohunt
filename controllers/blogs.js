const User = require("../models/User");
const BlogPost = require("../models/BlogPost");
const Category = require("../models/Category");

// @desc    Create New Post
// @route   Post /blog
// @access  private

exports.createPost = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Attach picture",
      });
    }
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: "title, description and category is mendatory",
      });
    }
    const categories = req.body.subCategories.split(",");

    const newBlogData = {
      title: req.body.Title,
      description: req.body.description,
      category: categories,
      owner: req.user._id,
      image: {
        url: req.file.path,
      },
    };
    const blog = await BlogPost.create(newBlogData);
    const user = await User.findById(req.user._id);
    user.blogs.push(blog._id);
    await user.save();
    return res.status(201).json({ success: true, blog });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete New Post(Blog)
// @route   delete /blog/delete/:id
// @access  private
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await BlogPost.findById(req.params.id);
    if (!blog) return res.status(404).send("Post Not Found");

    if (blog.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    await blog.remove();
    // after removing the blog from blogs we have to delete blog from user's blog list
    const user = await User.findById(req.user._id);
    const index = user.blogs.indexOf(req.params.id);
    user.blogs.splice(index, 1);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Post Delete Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update Post(Blog)
// @route   put /blog/update/:id
// @access  private

exports.updateBlog = async (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      return res.send({ success: false, message: "Enter Somthing" });
    }
    const blog = await BlogPost.findById(req.params.id);
    if (!blog) return res.status(404).send("Post Not Found");

    if (blog.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }
    const categories = req.body.subCategories.split(",");
    const newBlogData = {
      title: req.body.Title,
      description: req.body.description,
      category: categories,
      owner: req.user._id,
    };

    const updatedPost = await BlogPost.findByIdAndUpdate(
      req.params.id,
      newBlogData
    );
    if (req.file) {
      let blog = await BlogPost.findById(req.params.id);
      blog.image.url = req.file.path;
      await blog.save();
    }
    const updated = await BlogPost.findById(req.params.id);
    return res.status(200).json({ success: true, updated });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get Single Post(Blog)
// @route   Get /blog/:id
// @access  public

exports.singleBlog = async (req, res, next) => {
  try {
    const blog = await BlogPost.findById(req.params.id).populate("owner");
    if (!blog) {
      res.status(404).json({ success: false, massage: "Blog Not Found" });
    }
    res.status(200).json({ success: true, post: blog });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// @desc    Get all Posts(Blogs)
// @route   Get /blog/
// @access  public
exports.blogs = async (req, res, next) => {
  try {
    const page = Number(req.query.page) - 1 || 0;
    const limit = Number(req.query.limit) || 5;
    const search = req.query.search || "";
    let sort = req.query.sort || "createdAt";
    let category = req.query.category || "All";

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

    const blog = await BlogPost.find({
      title: { $regex: search, $options: "i" },
    })
      .where("category")
      .in([...categories])
      .sort(sortBy)
      .skip(page * limit)
      .limit(limit)
      .populate("owner");
    const blogCount = await BlogPost.count();
    res.status(200).json({ success: true, post: blog, total: blogCount });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Review Posts(Blogs)
// @route   Post /blog/:id/reviews
// @access  public

exports.createReview = async (req, res, next) => {
  try {
    let alreadyReviewed = false;

    const { rating, comment } = req.body;
    if (!rating || !comment) {
      return res
        .status(400)
        .json({ success: false, message: "Comment and Rating is Required" });
    }

    const blog = await BlogPost.findById(req.params.id);
    if (!blog) {
      return res.send({ success: false, message: "Blog Not Found" });
    }
    if (blog.owner.toString() === req.user._id.toString()) {
      return res.send({
        success: false,
        message: "You Can't Review your Own blog",
      });
    }

    if (blog) {
      alreadyReviewed = blog.reviews.find(
        (review) => review.user.toString() === req.user._id.toString()
      );
    }
    if (alreadyReviewed) {
      return res.send({ success: false, message: "Already Reviewed" });
    }
    const review = {
      name: req.user.firstName + " " + req.user.lastName,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    blog.reviews.push(review);
    blog.numReviews = blog.reviews.length;
    blog.rating =
      blog.reviews.reduce((acc, item) => item.rating + acc, 0) /
      blog.reviews.length;

    await blog.save();
    res.status(201).json({ success: true, message: "Review added" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Like and dislike Posts(Blogs)
// @route   Get /blog/:id/likes
// @access  private
exports.likeUnlikePost = async function (req, res, next) {
  try {
    const blog = await BlogPost.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!blog) {
      return res.send({ success: true, message: "Blog Not Found" });
    }

    // if already like so dislike the post/blog
    if (blog.likes.includes(req.user._id)) {
      // find that user index in the array of likes
      const index = blog.likes.indexOf(req.user._id);
      // find that like in that users likes
      const user_like_index = user.likes.blog.indexOf(req.params.id);

      // delete that id from likes array
      blog.likes.splice(index, 1);
      user.likes.blog.splice(user_like_index, 1);

      await blog.save();
      await user.save();
      return res.send({
        success: true,
        message: "Post Unliked",
      });
    } else {
      blog.likes.push(req.user._id);
      user.likes.blog.push(req.params.id);
      await blog.save();
      await user.save();
      return res.send({
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
