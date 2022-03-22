const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const sendMessage = expressAsyncHandler(async (req, res) => {
  // requirements for sending a message: {recepient_id, sender_id, message_itself}

  const { message_itself, recepient_id } = req.body;

  // if message_itself and recepient_id is not found inside requests body
  if (
    !message_itself ||
    message_itself.replace(/\s/g, "") == "" ||
    message_itself == undefined ||
    message_itself.length == 0 ||
    !recepient_id
  ) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: message_itself,
    recepient: recepient_id,
  };

  try {
    var message = await Message.create(newMessage);
    message = await message.populate("sender", ["name", "pic"]);
    message = await message.populate("recepient");
    message = await User.populate(message, [
      {
        path: "recepient.users",
        select: "name pic email",
      },
    ]);

    await Chat.findByIdAndUpdate(req.body.recepient_id, {
      latestMessage: message,
    });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = expressAsyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({
      recepient: req.params.recepient_id,
    })
      .populate("sender", ["name", "pic", "email"])
      .then(["recepient"]);

    res.json(messages);
  } catch (error) {
    res.sendStatus(400);
    throw new Error(error.message);
  }
});
module.exports = { sendMessage, allMessages };
