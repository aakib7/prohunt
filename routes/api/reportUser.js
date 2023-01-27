const express = require("express");
const router = express.Router();
const { reportUser, getReportUser } = require("../../controllers/reportUser");

const { isAuthenticated } = require("../../middlewares/auth");

router.post("/", isAuthenticated, reportUser);
router.get("/", getReportUser);

module.exports = router;
