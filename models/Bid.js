const mongoose = require("mongoose");
const bidSchema = mongoose.Schema({
  description: {
    type: String,
    required: [true, "Please enter description"],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  status: Boolean,
});

module.exports = mongoose.model("Bid", bidSchema);
