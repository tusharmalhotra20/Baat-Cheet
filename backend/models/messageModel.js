const mongoose = require("mongoose");
const messageModel = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    recepient: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  },
  { timestamps: true, strictPopulate: false }
);
const Message = mongoose.model("Message", messageModel);
module.exports = Message;
