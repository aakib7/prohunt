const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../../middlewares/auth");
const {
  totalRecord,
  getUsers,
  getUserJoinMonth,
  getOrderDetails,
  getOrderMonthsVise,
  addContactUs,
  addSubscription,
  getSubscriptions,
  getContactUs,
  sendWarning,
  block,
} = require("../../controllers/admin");

// router.post("/:id", isAuthenticated, createBid);
router.get("/", totalRecord);
router.get("/users", getUsers);
router.get("/users/join", getUserJoinMonth);
router.get("/orders", getOrderDetails);
router.get("/orders/details", getOrderMonthsVise);
router.post("/contact", addContactUs);
router.post("/subsecription", addSubscription);
router.get("/contact", getContactUs);
router.get("/subscription", getSubscriptions);
router.post("/warning", sendWarning);
router.post("/block/user", block);

module.exports = router;
