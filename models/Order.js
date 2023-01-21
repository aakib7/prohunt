const mongoose = require("mongoose");
const orderSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "please enter title"],
    },
    rating: {
      type: Number,
      default: 1,
    },
    isRated: {
      type: Boolean,
      default: false,
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
    todo: [
      {
        summery: { type: String, required: true },
        milstoneNumber: { type: Number, required: true },
        milstoneWeightage: { type: Number, required: true },
        status: {
          type: Boolean,
          required: true,
        },
        dueDate: { type: String, required: true },
      },
      {
        timestamps: true,
      },
    ],
    progress: { type: Number, default: 0 },
    orderDate: { type: Date, default: new Date() },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
