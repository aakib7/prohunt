const User = require("../models/User");
const Token = require("../models/Token");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const config = require("config");
const ErrorHandler = require("../utils/errorHandler");
const sendEmail = require("../middlewares/sendEmail");

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
        avatar: { public_id: "sample_id", url: "sample_url" },
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
      console.log(url);
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
    if (!req.body) {
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
