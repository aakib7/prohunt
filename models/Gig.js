const mongoose = require("mongoose");

const gigSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter title for the gig"],
    },
    description: {
      type: String,
      required: [true, "Please enter description"],
    },
    category: {
      type: Array,
      required: [true, "Please Selete Category"],
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
    offers: [
      {
        owner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        offer: {
          type: String,
          required: true,
        },
      },
    ],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    deliveredTime: {
      type: "string",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gig", gigSchema);
