const express = require("express");
const router = express.Router();
const {
  createConversation,
  getConversation,
} = require("../../controllers/conversation");
const { isAuthenticated } = require("../../middlewares/auth");

router.post("/", isAuthenticated, createConversation);
router.get("/:userId", isAuthenticated, getConversation);

module.exports = router;
