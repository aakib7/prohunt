const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const ErrorHandler = require("../utils/errorHandler");

exports.register = async (req, res, next) => {
  try {
    let { userName, email, password, firstName, lastName, country } = req.body;
    let user = await User.findOne({ userName });

    if (user) {
      return next(new ErrorHandler("User name already Taken", 400));
    }

    let user1 = await User.findOne({ email });
    if (user1) {
      return res.status(400).json({
        success: false,
        message: "User already exist with this email",
      });
    } else {
      let salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
      user = await User.create({
        userName,
        email,
        password,
        firstName,
        lastName,
        country,
        avatar: { public_id: "sample_id", url: "sample_url" },
      });
      // user will automatacally login after registration

      const token = jwt.sign(
        {
          _id: user._id,
          userName: user.userName,
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
    const user = await User.findById(req.user._id).populate("gigs");
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
