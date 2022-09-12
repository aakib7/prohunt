const express = require("express");
const router = express.Router();
const {
  createGig,
  totalGigs,
  deleteGig,
  singleGig,
  gigs,
} = require("../../controllers/gigs");
const { isAuthenticated } = require("../../middlewares/auth");

router.get("/", gigs);
router.post("/creategig", isAuthenticated, createGig);
router.get("/:id", singleGig);
router.get("/get", isAuthenticated, totalGigs);
router.delete("/deletegig/:id", isAuthenticated, deleteGig);

module.exports = router;
