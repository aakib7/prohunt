const express = require("express");
const router = express.Router();
const {
  register,
  logout,
  login,
  myProfile,
  changePassword,
  uploadPicture,
  updateUser,
  varifyAccount,
  forgetPassword,
  setNewPassword,
} = require("../../controllers/users");
const { isAuthenticated } = require("../../middlewares/auth");
const { uploadProfilePicture } = require("../../middlewares/uploadFiles");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "public/images/uploaded/users");
  },
  filename: (req, file, callBack) => {
    callBack(null, `${Date.now() + file.originalname.split(" ").join("-")}`);
  },
});
let upload = multer({ storage });

/* GET users listing. */
router.post("/register", register);
// router.put("/upload", isAuthenticated, uploadProfilePicture, uploadPicture);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", isAuthenticated, myProfile);
router.get("/:id/verify/:token/", varifyAccount);
router.post("/forget-password", forgetPassword);
router.post("/password-reset/:id/:token", setNewPassword);
router.post("/changepassword", isAuthenticated, changePassword);
router.put("/update", isAuthenticated, upload.single("users"), updateUser);

module.exports = router;
