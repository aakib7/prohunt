const express = require("express");
const router = express.Router();
const {
  createGig,
  totalGigs,
  deleteGig,
  singleGig,
  getGigs,
  createReview,
} = require("../../controllers/gigs");
const { isAuthenticated } = require("../../middlewares/auth");

router.get("/", getGigs);
router.post("/creategig", isAuthenticated, createGig);
router.get("/:id", singleGig);
router.get("/get", isAuthenticated, totalGigs);
router.delete("/deletegig/:id", isAuthenticated, deleteGig);
router.post("/:id/reviews", isAuthenticated, createReview);

module.exports = router;
