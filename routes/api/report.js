const express = require("express");
const router = express.Router();
const { generateReport } = require("../../controllers/report");
const { isAuthenticated } = require("../../middlewares/auth");

router.get("/", isAuthenticated, generateReport);

module.exports = router;
