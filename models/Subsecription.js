const mongoose = require("mongoose");
const subscriptionSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subsecription", subscriptionSchema);
