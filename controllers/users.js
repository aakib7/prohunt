const User = require("../models/User");
const Token = require("../models/Token");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const config = require("config");
const ErrorHandler = require("../utils/errorHandler");
const sendEmail = require("../middlewares/sendEmail");
const Gig = require("../models/Gig");
const Job = require("../models/Job");
const BlogPost = require("../models/BlogPost");

exports.register = async (req, res, next) => {
  // console.log(req.body);
  try {
    let { email, password, firstName, lastName, country, role, userName } =
      req.body;
    let user = await User.findOne({ userName });
    if (user) {
      return res.send({
        success: false,
        message: "User already exist with this User Name",
      });
    }

    let user1 = await User.findOne({ email });
    if (user1) {
      return res.send({
        success: false,
        message: "User already exist with this email",
      });
    } else {
      let salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);

      let user = await User.create({
        userName,
        email,
        password,
        firstName,
        lastName,
        country,
        role,
        avatar: {
          public_id: "Avatar",
          url: "public/images/uploaded/users/profile.jpeg",
        },
        about: "nothing",
      });
      // user will automatacally login after registration
      // console.log(user);

      // const token = jwt.sign(
      //   {
      //     _id: user._id,
      //     userName: user.userName,
      //     email: user.email,
      //   },
      //   config.get("jwtPrivateKey")
      // );
      const token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
      const url = `http://localhost:3000/user/${user.id}/verify/${token.token}`;
      let message = `<h2>Please Click The Link To Varify Your Account At ProHunt</h2>
      <a href=${url}>${url}</a>`;

      await sendEmail(user.email, "Account Verify Email", message);
      return res.status(201).send({
        success: true,
        message: "An Email sent to your account please verify",
      });
    }
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// upload Profile Picture
exports.uploadPicture = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);
    if (req.file) {
      user.avatar.public_id = req.file.filename;
      user.avatar.url = req.file.path;
    }
    await user.save();
    return res.status(200).json({
      success: true,
      image: user.avatar.url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email }).select("+password");
    // because select:false for password to select password we use select(+password)

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not exist",
      });
    }
    if (!user.verified) {
      return res.status(400).json({
        success: false,
        message: "User is not Varified. Please Check Your Mail",
      });
    } else {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({
          success: false,
          message: "Incorrect Password",
        });
      } else {
        const token = jwt.sign(
          {
            _id: user._id,
            name: user.name,
            email: user.email,
          },
          config.get("jwtPrivateKey")
        );
        return res
          .status(200)
          .cookie("token", token, {
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
          })
          .json({
            success: true,
            user,
            token,
          });
      }
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Logout
exports.logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      })
      .json({
        success: true,
        message: "User logged Out",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.changePassword = async (req, res) => {
  try {
    let { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Provide Old and New Password",
      });
    }

    const user = await User.findById(req.user._id).select("+password");
    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Old Password",
      });
    } else {
      let salt = await bcrypt.genSalt(10);
      newPassword = await bcrypt.hash(newPassword, salt);
      user.password = newPassword;
      await user.save();
      return res.status(200).json({
        success: true,
        message: "Password Changed successfully",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
// get current user profile me
exports.myProfile = async (req, res) => {
  try {
    // const user = await User.findById(req.user._id).populate("gigs");
    const user = await User.findById(req.user._id);
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.updateUser = async (req, res) => {
  try {
    if (Object.keys(req.body).length === 0 && !req.file) {
      return res.send({ success: false, message: "Enter Somthing" });
    }
    await User.findByIdAndUpdate(req.user._id, req.body);
    if (req.file) {
      let u = await User.findById(req.user._id);
      u.avatar.public_id = req.file.filename;
      u.avatar.url = req.file.path;
      await u.save();
    }
    const user = await User.findById(req.user._id);
    return res.send({ success: true, user });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.varifyAccount = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user)
      return res.status(400).send({ success: false, message: "Invalid link" });
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token)
      return res.status(400).send({ success: false, message: "Invalid link" });

    await User.updateOne({ email: user.email }, { $set: { verified: true } });
    await token.remove();

    return res
      .status(200)
      .send({ success: true, message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "Internal Server Error" });
  }
};
// forget password apis
exports.forgetPassword = async (req, res, next) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(409).json({
        success: false,
        message: "User with given email does not exist!",
      });
    }

    // if (!user.verified) {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Your email is not varified",
    //   });
    // }

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
    }

    const url = `http://localhost:3000/password-reset/${user._id}/${token.token}/`;
    let message = `<h2>Plese click the bellow link to set a new password.</h2>
      <a href=${url}>${url}</a>`;
    await sendEmail(user.email, "Password Reset", message);

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email account",
    });
  } catch (error) {
    res.status(500).json({ seccess: false, message: "Internal Server Error" });
  }
};
// exports.varifyPasswordLink = async (req, res, next) => {
//   try {
//     const user = await User.findOne({ _id: req.params.id });
//     if (!user)
//       return res.status(400).json({ success: false, message: "Invalid link" });

//     const token = await Token.findOne({
//       userId: user._id,
//       token: req.params.token,
//     });
//     if (!token)
//       return res.status(400).json({ success: true, message: "Invalid link" });

//     res.status(200).send("Valid Url");
//   } catch (error) {
//     res.status(500).send({ message: "Internal Server Error" });
//   }
// };
exports.setNewPassword = async (req, res, next) => {
  try {
    console.log("r");
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid link" });
    }
    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      return res.status(400).json({ success: false, message: "Invalid link" });
    }
    if (!user.verified) {
      user.verified = true;
    }
    let salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(req.body.password, salt);
    user.password = newPassword;
    await user.save();
    await token.remove();
    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
// get user gigs
exports.getMygigs = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== "freelancer") {
      return res.status(401).json({
        success: false,
        message: "Not Allowed",
      });
    }

    const gigs = [];

    for (let i = 0; i < user.gigs.length; i++) {
      const gig = await Gig.findById(user.gigs[i]);
      gigs.push(gig);
    }

    return res.status(200).json({
      success: true,
      gigs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getMyJobs = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    // if (user.role !== "client") {
    //   return res.status(401).json({
    //     success: false,
    //     message: "Not Allowed",
    //   });
    // }

    const jobs = [];

    for (let i = 0; i < user.jobs.length; i++) {
      const job = await Job.findById(user.jobs[i]);
      jobs.push(job);
    }

    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getAllFreelancer = async (req, res, next) => {
  try {
    const page = Number(req.query.page) - 1 || 0;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";
    const freelancer = await User.find({
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ],
      role: "freelancer",
    })
      .skip(page * limit)
      .limit(limit);
    if (!freelancer) {
      return res.status(404).json({
        success: false,
        message: "No Freelancer Yet",
      });
    }
    const freelancerCount = await User.find({ role: "freelancer" }).count();
    return res.status(200).json({
      success: true,
      freelancer,
      total: freelancerCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getAllClients = async (req, res, next) => {
  try {
    const client = await User.find({ role: "client" });
    if (!client) {
      return res.status(404).json({
        success: false,
        message: "No Freelancer Yet",
      });
    }
    return res.status(200).json({
      success: true,
      client,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getMyBlogs = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    const blogs = [];

    for (let i = 0; i < user.blogs.length; i++) {
      const blog = await BlogPost.findById(user.blogs[i]);
      blogs.push(blog);
    }

    return res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getUsers = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit) || 8;
    const search = req.query.search || "";
    const users = await User.find({
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ],
    }).limit(limit);
    if (!users) {
      return res.status(404).json({
        success: false,
        message: "No User",
      });
    }
    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.getUserPortfolio = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("portfolio");
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
