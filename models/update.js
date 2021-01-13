/** ******
* update.js file (models)
****** */

const mongoose = require('mongoose');

const UpdateSchema = mongoose.Schema(
  {
    functionnality: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categories',
      required: true,
    },
    object: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['A venir', 'En cours', 'En ligne'],
      required: true,
    },
    disponibility: {
      type: String,
      enum: ['Tous les membres', 'Premium uniqueent'],
      required: true,
    },
    releaseDate: {
      type: Date,
      require: true,
    },
    details: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const UpdateModel = mongoose.model('Update', UpdateSchema);
module.exports = UpdateModel;
