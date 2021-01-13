/** ******
* categories.js file (model)
******* */

const mongoose = require('mongoose');

const categoriesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const CategoriesModel = mongoose.model('Categories', categoriesSchema);
module.exports = CategoriesModel;
