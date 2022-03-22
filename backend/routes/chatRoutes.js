const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controller/chatControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

//for accessing and creating the chat
//if user is not logged-in then they can't access the chat that's why used the "protect" middleware
router.route("/").post(protect, accessChat);

// for getting all of the chat from the database of the particular user
router.route("/").get(protect, fetchChats);

//for creation of a group
router.route("/group").post(protect, createGroupChat);

//for renaming of a group
router.route("/rename").put(protect, renameGroup)

//for adding members to group
router.route("/groupadd").put(protect, addToGroup)

//for removing someone from the group
router.route("/groupremove").put(protect, removeFromGroup)


module.exports = router;
