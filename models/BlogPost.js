const mongoose = require("mongoose");
const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter title for the Your Post."],
  },
  description: {
    type: String,
    required: [true, "Please enter description"],
  },
  category: {
    type: Array,
    required: [true, "Please Selete Category"],
  },
  image: {
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
});

module.exports = mongoose.model("BlogPost", blogSchema);
