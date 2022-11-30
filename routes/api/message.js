const express = require("express");
const router = express.Router();
const { addMessage, getMessage } = require("../../controllers/message");
const { isAuthenticated } = require("../../middlewares/auth");

router.post("/", isAuthenticated, addMessage);
router.get("/:conversationId", isAuthenticated, getMessage);

module.exports = router;
