const express = require("express");
const router = express.Router();
const {
  createPost,
  deleteBlog,
  updateBlog,
  singleBlog,
  blogs,
  createReview,
  likeUnlikePost,
} = require("../../controllers/blogs");
const { isAuthenticated } = require("../../middlewares/auth");

router.post("/create", isAuthenticated, createPost);
router.delete("/delete/:id", isAuthenticated, deleteBlog);
router.put("/update/:id", isAuthenticated, updateBlog);
router.get("/", blogs);
router.get("/:id", singleBlog);
router.post("/:id/reviews", isAuthenticated, createReview);
router.get("/:id/likes", isAuthenticated, likeUnlikePost);

module.exports = router;
