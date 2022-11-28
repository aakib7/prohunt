const express = require("express");
const router = express.Router();
const { createOrder, getOrders, getOrder } = require("../../controllers/order");
const { isAuthenticated } = require("../../middlewares/auth");

router.post("/", isAuthenticated, createOrder);
router.get("/", getOrders);
router.get("/:id", getOrder);

module.exports = router;
