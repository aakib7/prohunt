const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../../middlewares/auth");
const {
  totalRecord,
  getUsers,
  getUserJoinMonth,
} = require("../../controllers/admin");

// router.post("/:id", isAuthenticated, createBid);
router.get("/", isAuthenticated, totalRecord);
router.get("/users", isAuthenticated, getUsers);
router.get("/users/join", isAuthenticated, getUserJoinMonth);

module.exports = router;
