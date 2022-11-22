const mongoose = require("mongoose");

const jobSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter title for the gig"],
  },
  description: {
    type: String,
    required: [true, "Please enter description"],
  },
  price: {
    type: Number,
    required: [true, "Please set price for gig"],
  },
  image: {
    public_id: String,
    url: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  reviews: [
    {
      name: { type: String, required: true },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      comment: {
        type: String,
        required: true,
      },
      rating: { type: Number, required: true },
    },
    {
      timestamps: true,
    },
  ],
  bids: [
    {
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      description: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
      status: { type: Boolean, default: false },
    },
  ],
  numReviews: {
    type: Number,
    required: true,
    default: 0,
  },
  category: {
    type: Array,
    required: [true, "Please Selete Category"],
  },
  deliveredTime: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Job", jobSchema);
