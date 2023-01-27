const mongoose = require("mongoose");
const repotedUserSchema = mongoose.Schema(
  {
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RepotedUser", repotedUserSchema);
