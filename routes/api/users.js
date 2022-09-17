const express = require("express");
const router = express.Router();
const {
  register,
  logout,
  login,
  myProfile,
  changePassword,
  uploadPicture,
} = require("../../controllers/users");
const { isAuthenticated } = require("../../middlewares/auth");
const { uploadProfilePicture } = require("../../middlewares/uploadFiles");

/* GET users listing. */
router.post("/register", register);
router.post("/upload", isAuthenticated, uploadProfilePicture, uploadPicture);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isAuthenticated, myProfile);
router.post("/changepassword", isAuthenticated, changePassword);

module.exports = router;
