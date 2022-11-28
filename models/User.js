const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  country: String,
  userName: {
    type: String,
    required: [true, "Please Enter a Name"],
    unique: true,
  },
  role: {
    type: String,
    required: true,
    default: "freelancer",
  },
  email: {
    type: String,
    required: [true, "Please Enter a Name"],
    unique: [true, "Email already exists"],
  },
  avatar: {
    public_id: String,
    url: String,
  },
  password: {
    type: String,
    required: [true, "Please Enter a Password"],
    minLength: [6, "Password must be at least 6 characters"],
    select: false, // not select on select query
  },
  gigs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
    },
  ],
  jobs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogPost",
    },
  ],
  bids: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bid",
    },
  ],
  completedProject: {
    type: Number,
    default: 0,
  },
  onGoingProject: {
    type: Number,
    default: 0,
  },
  likes: {
    blog: [],
    gigs: [],
    jobs: [],
  },
  about: {
    type: String,
  },
  role: String,
  verified: {
    type: Boolean,
    default: false,
  },
  joined: {
    type: Date,
    default: Date.now,
  },
  skills: {
    type: Array,
    required: [true, "Please Selete Category"],
  },
  enterDetails: {
    type: Boolean,
    default: false,
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  language: {
    type: String,
    default: "English",
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
module.exports = mongoose.model("User", userSchema);
