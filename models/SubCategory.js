const mongoose = require("mongoose");
const subCategorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
});

module.exports = mongoose.model("SubCategory", subCategorySchema);
