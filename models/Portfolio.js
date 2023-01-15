const mongoose = require("mongoose");
const portfolioSchema = mongoose.Schema(
  {
    introduction: {
      type: String,
      required: [true, "Please enter introduction"],
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    pictures: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Portfolio", portfolioSchema);
