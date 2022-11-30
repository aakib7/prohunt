const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderOfOwner,
  getOrderOfFreelancer,
} = require("../../controllers/order");
const { isAuthenticated } = require("../../middlewares/auth");

router.post("/", isAuthenticated, createOrder);
router.get("/", getOrders);
router.get("/client", isAuthenticated, getOrderOfOwner);
router.post("/freelancer", getOrderOfFreelancer);

module.exports = router;
