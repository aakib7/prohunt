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
  getMygigs,
  getMyJobs,
  getAllFreelancer,
  getAllClients,
  getMyBlogs,
  getUser,
  getUsers,
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
router.get("/gigs", isAuthenticated, getMygigs);
router.get("/jobs", isAuthenticated, getMyJobs);
router.get("/blogs", isAuthenticated, getMyBlogs);
router.get("/me", isAuthenticated, myProfile);
router.get("/:id/verify/:token/", varifyAccount);
router.get("/freelancers", getAllFreelancer);
router.get("/clients", getAllClients);
router.get("/user/:id", getUser);
router.get("/", getUsers);
router.post("/forget-password", forgetPassword);
router.post("/password-reset/:id/:token", setNewPassword);
router.post("/changepassword", isAuthenticated, changePassword);
router.put("/update", isAuthenticated, upload.single("users"), updateUser);

module.exports = router;
