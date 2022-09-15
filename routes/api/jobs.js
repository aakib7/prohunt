const express = require("express");
const router = express.Router();
const { getJobs } = require("../../controllers/jobs");
const { isAuthenticated } = require("../../middlewares/auth");

router.get("/", getJobs);

// router.post("/creategig", isAuthenticated, createGig);
// router.get("/:id", singleGig);
// router.get("/get", isAuthenticated, totalGigs);
// router.delete("/deletegig/:id", isAuthenticated, deleteGig);
// router.post("/:id/reviews", isAuthenticated, createReview);

module.exports = router;
