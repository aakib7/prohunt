const mongoose = require("mongoose");
const paymentSchema = mongoose.Schema(
  {
    sendBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sendTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    amount: {
      type: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
