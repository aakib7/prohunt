const express = require("express");
const router = express.Router();
const { createBid, getBids } = require("../../controllers/bids");
const { isAuthenticated } = require("../../middlewares/auth");

router.post("/:id", isAuthenticated, createBid);
router.get("/:id", isAuthenticated, getBids);

module.exports = router;
