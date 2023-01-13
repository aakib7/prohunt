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
} = require("../../controllers/order");
const { isAuthenticated } = require("../../middlewares/auth");

router.post("/", isAuthenticated, createOrder);
router.get("/", getOrders);
router.get("/:id", getSingleOrder);
router.post("/client/orders", isAuthenticated, getOrderOfOwner);
router.post("/freelancer", getOrderOfFreelancer);
router.post("/manage/:id", isAuthenticated, manageProject);
router.post("/changeStatus/:id", isAuthenticated, milstoneStatusChange);
router.get("/complete/:id", isAuthenticated, completeOrder);

module.exports = router;
