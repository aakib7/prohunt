const express = require("express");
const router = express.Router();
const {
  getJobs,
  createJob,
  singleJob,
  deleteJob,
  createReview,
  updateJob,
  allJob,
} = require("../../controllers/jobs");

const { isAuthenticated } = require("../../middlewares/auth");

router.get("/", getJobs);
router.get("/jobs", allJob);

router.post("/createjob", isAuthenticated, createJob);
router.get("/:id", singleJob);
// router.get("/get", isAuthenticated, totalGigs);
router.put("/:id", isAuthenticated, updateJob);
router.delete("/deletejob/:id", isAuthenticated, deleteJob);
router.post("/:id/reviews", isAuthenticated, createReview);

module.exports = router;
