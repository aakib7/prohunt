const express = require("express");
const router = express.Router();
const {
  createGig,
  totalGigs,
  deleteGig,
  singleGig,
  getGigs,
  createReview,
  likeUnlikeGig,
  updateGig,
} = require("../../controllers/gigs");
const { isAuthenticated } = require("../../middlewares/auth");

// image upload method
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "public/images/uploaded/gigs");
  },
  filename: (req, file, callBack) => {
    callBack(null, `${Date.now() + file.originalname.split(" ").join("-")}`);
  },
});
let upload = multer({ storage });

router.post("/creategig", isAuthenticated, upload.single("gig"), createGig);
router.get("/", getGigs);
router.get("/get", isAuthenticated, totalGigs);
router.get("/:id", singleGig);
router.put("/:id", isAuthenticated, upload.single("gig"), updateGig);
router.get("/gig/:id/like", isAuthenticated, likeUnlikeGig);
router.delete("/deletegig/:id", isAuthenticated, deleteGig);
router.post("/:id/reviews", isAuthenticated, createReview);

module.exports = router;
