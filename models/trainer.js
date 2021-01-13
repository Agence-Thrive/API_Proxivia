/** *******
* trainer.js file
******* */

const mongoose = require('mongoose');

const TrainerSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  photo: {
    type: Buffer,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  totalTraining: {
    type: Number,
    required: true,
  },
  totalViews: {
    type: Number,
    required: true,
  },
  totalArticle: {
    type: Number,
    required: true,
  },
},
{
  timestamp: true,
});

TrainerSchema.methods.addTraining = async function () {
  this.totalTraining += 1;
  await this.save();
};

TrainerSchema.methods.addViews = async function () {
  this.totalViews += 1;
  await this.save();
};

TrainerSchema.methods.addArticle = async function addArticle() {
  this.totalArticle += 1;
  await this.save();
};

const TrainerModel = mongoose.model('Trainer', TrainerSchema);
module.exports = TrainerModel;
