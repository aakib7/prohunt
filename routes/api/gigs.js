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
} = require("../../controllers/gigs");
const { isAuthenticated } = require("../../middlewares/auth");

router.post("/creategig", isAuthenticated, createGig);
router.get("/", getGigs);
router.get("/get", isAuthenticated, totalGigs);
router.get("/:id", singleGig);
router.get("/gig/:id/like", isAuthenticated, likeUnlikeGig);
router.delete("/deletegig/:id", isAuthenticated, deleteGig);
router.post("/:id/reviews", isAuthenticated, createReview);

module.exports = router;
