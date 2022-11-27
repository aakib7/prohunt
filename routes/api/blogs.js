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

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "public/images/uploaded/blogs");
  },
  filename: (req, file, callBack) => {
    callBack(null, `${Date.now() + file.originalname.split(" ").join("-")}`);
  },
});
let upload = multer({ storage });

router.post("/create", isAuthenticated, upload.single("blog"), createPost);
router.delete("/delete/:id", isAuthenticated, deleteBlog);
router.put("/update/:id", isAuthenticated, upload.single("blog"), updateBlog);
router.get("/", blogs);
router.get("/:id", singleBlog);
router.post("/:id/reviews", isAuthenticated, createReview);
router.get("/:id/likes", isAuthenticated, likeUnlikePost);

module.exports = router;
