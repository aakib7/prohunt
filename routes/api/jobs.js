const express = require("express");
const router = express.Router();
const {
  getJobs,
  createJob,
  singleJob,
  deleteJob,
  createReview,
} = require("../../controllers/jobs");

const { isAuthenticated } = require("../../middlewares/auth");

router.get("/", getJobs);
router.post("/createjob", isAuthenticated, createJob);
router.get("/:id", singleJob);
// router.get("/get", isAuthenticated, totalGigs);
router.delete("/deletejob/:id", isAuthenticated, deleteJob);
router.post("/:id/reviews", isAuthenticated, createReview);

module.exports = router;
