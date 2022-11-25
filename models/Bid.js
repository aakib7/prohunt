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
  createdAt: new Date(),
  status: { Boolean, default: "Pending" },
  timestamps: true,
});

module.exports = mongoose.model("Bid", bidSchema);
