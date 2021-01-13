/** ******
*  prospect.js file (models)
****** */

const mongoose = require('mongoose');
const validator = require('validator');

const ProspectSchema = mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, 'Prospect firstname is required'],
      lowaercase: true,
    },
    lastname: {
      type: String,
      required: [true, 'name is required'],
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      lowercase: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error({ error: 'Invalid Email address' });
        }
      },
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    postal: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    age: {
      type: Number,
      required: true,
    },
    houseValue: {
      type: Number,
      required: true,
    },
    commission: {
      type: Number,
      required: true,
    },
    area: {
      type: Number,
      required: true,
    },
    houseImage: {
      type: [Buffer],
      required: false,
    },
    status: {
      type: String,
      enum: ['non', 'peut-être', 'oui'],
      required: true,
    },
    progress: {
      type: Number,
      required: true,
    },
    master: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

ProspectSchema.statics.getProspectLost = async () => {
  try {
    const prospects = await ProspectModel.find({ status: 'non' });
    return prospects;
  } catch (error) {
    throw new Error(error.message);
  }
};

ProspectSchema.statics.getProspectWon = async () => {
  try {
    const prospects = await ProspectModel.find({ status: 'oui' });
    return prospects;
  } catch (error) {
    throw new Error(error.message);
  }
};

ProspectSchema.statics.getProspectInProgress = async () => {
  try {
    const prospects = await ProspectModel.find({ status: 'peut-être' });
    return prospects;
  } catch (error) {
    throw new Error(error.message);
  }
};

const ProspectModel = mongoose.model('Prospect', ProspectSchema);
module.exports = { ProspectModel, ProspectSchema };
