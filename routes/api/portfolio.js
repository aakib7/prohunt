const express = require("express");
const router = express.Router();
const {
  createPortfolio,
  getSinglePortfolio,
  getPortfolio,
  deletePortfolio,
} = require("../../controllers/portfolio");
const { isAuthenticated } = require("../../middlewares/auth");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, "public/images/uploaded/portfolio");
  },
  filename: (req, file, callBack) => {
    callBack(null, `${Date.now() + file.originalname.split(" ").join("-")}`);
  },
});
let upload = multer({ storage });

router.post(
  "/",
  isAuthenticated,
  upload.array("portfolio", 5),
  createPortfolio
);
router.get("/:id", isAuthenticated, getSinglePortfolio);
router.get("/", isAuthenticated, getPortfolio);
router.delete("/:id", isAuthenticated, deletePortfolio);

module.exports = router;
