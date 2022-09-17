const multer = require("multer");
exports.uploadProfilePicture = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/images/uploaded/users");
    },
    filename: function (req, file, callBack) {
      callBack(null, `${Date.now() + file.originalname.split(" ").join("-")}`);
    },
  }),
}).single("users");
