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
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "public/images/uploaded/jobs");
  },
  filename: (req, file, callBack) => {
    callBack(null, `${Date.now() + file.originalname.split(" ").join("-")}`);
  },
});
let upload = multer({ storage });

router.get("/", getJobs);
router.get("/jobs", allJob);

router.post("/createjob", isAuthenticated, upload.single("job"), createJob);
router.get("/:id", singleJob);
// router.get("/get", isAuthenticated, totalGigs);
router.put("/:id", isAuthenticated, updateJob);
router.delete("/deletejob/:id", isAuthenticated, deleteJob);
router.post("/:id/reviews", isAuthenticated, createReview);

module.exports = router;
