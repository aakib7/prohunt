const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderOfOwner,
  getOrderOfFreelancer,
  manageProject,
  milstoneStatusChange,
  getSingleOrder,
  completeOrder,
  getFreelancerTeamOrder,
  rateOrder,
  createPayment,
  getPayment,
} = require("../../controllers/order");
const { isAuthenticated } = require("../../middlewares/auth");

router.post("/", isAuthenticated, createOrder);
router.get("/", getOrders);
router.get("/teamOrder", isAuthenticated, getFreelancerTeamOrder);
router.get("/:id", getSingleOrder);
router.post("/client/orders", isAuthenticated, getOrderOfOwner);
router.post("/freelancer", getOrderOfFreelancer);
router.post("/manage/:id", isAuthenticated, manageProject);
router.post("/changeStatus/:id", isAuthenticated, milstoneStatusChange);
router.get("/complete/:id", isAuthenticated, completeOrder);
router.put("/rate/:id", isAuthenticated, rateOrder);
router.post("/payment", isAuthenticated, createPayment);
router.get("/payment/all", getPayment);

module.exports = router;
