/** ******
* company.js file (model)
****** */

const mongoose = require('mongoose');
const validator = require('validator');

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    legalType: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error({ error: 'Invalid Email addresse' });
        }
      },
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    postcode: {
      type: String,
      required: true,
    },
    siret: {
      type: String,
      required: true,
    },
    tva: {
      type: String,
      required: true,
    },
    tCard: {
      type: String,
      required: true,
    },
    commercialChamber: {
      type: String,
      required: true,
    },
    date: {
      type: Number,
      required: true,
    },
    mendatoryParticulars: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    mediator: {
      firstname: {
        type: String,
      },
      lastname: {
        type: String,
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
      required: false,
    },
    master: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    collaborators: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }],
    avatar: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

companySchema.methods.addCollaborators = async function (collaborator) {
  const company = this;

  company.collaborators = company.collaborators.concat(collaborator);
  await company.save();
};

companySchema.statics.findById = async (id) => {
  try {
    const company = await CompanyModel.findOne({ _id: id });
    if (!company) {
      throw new Error({ error: 'Invalid id' });
    }
    return company;
  } catch (e) {
    throw new Error(e);
  }
};

const CompanyModel = mongoose.model('Company', companySchema);
module.exports = CompanyModel;
