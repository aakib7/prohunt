const Message = require("../models/Message");

exports.addMessage = async (req, res, next) => {
  try {
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "enter somthing",
      });
    }

    const message = await Message.create(req.body);
    return res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getMessage = async (req, res, next) => {
  try {
    if (!req.params.conversationId) {
      return res.status(400).json({
        success: false,
        message: "enter conversation id",
      });
    }
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
