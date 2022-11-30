const mongoose = require("mongoose");
const orderSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "please enter title"],
    },
    description: {
      type: String,
      required: [true, "please enter description"],
    },
    price: {
      type: Number,
      required: [true, "please enter price/budget"],
    },
    deliverdTime: {
      type: String,
      required: [true, "please enter deliverd time"],
    },
    orderType: {
      type: String,
      required: [true, "please enter order type i.e Gig/Job"],
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    orderTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
