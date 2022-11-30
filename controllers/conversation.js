const Conversation = require("../models/Conversation");

exports.createConversation = async (req, res, next) => {
  try {
    if (!req.body.senderId || !req.body.receiverId) {
      return res.status(400).json({
        success: false,
        message: "enter both sender and receiver ids",
      });
    }
    const existingConversation = await Conversation.findOne({
      members: { $all: [req.body.senderId, req.body.receiverId] },
    });

    if (existingConversation) {
      return res.status(200).json({
        success: true,
        conversation: existingConversation,
      });
    }
    if (!existingConversation) {
      const newConversation = {
        members: [req.body.senderId, req.body.receiverId],
      };
      const conversation = await Conversation.create(newConversation);
      return res.status(200).json({
        success: true,
        conversation,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//get conv of a user
exports.getConversation = async (req, res, next) => {
  try {
    console.log(req.params.userId);
    if (!req.params.userId) {
      return res.status(400).json({
        success: false,
        message: "Provide User ID",
      });
    }
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    if (!conversation) {
      return res.status(400).json({
        success: false,
        message: "No Conversations",
      });
    }
    return res.status(200).json({
      success: true,
      conversation: conversation.reverse(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
