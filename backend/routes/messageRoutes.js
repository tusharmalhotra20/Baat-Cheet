const express = require("express");
const {
  sendMessage,
  allMessages,
} = require("../controller/messageControllers");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// Responsible for sending the message
router.route("/").post(protect, sendMessage);

// Responsible for fetching all messages for a particular chat
router.route("/:recepient_id").get(protect, allMessages);

module.exports = router;
