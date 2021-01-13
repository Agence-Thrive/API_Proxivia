/** ******
 * user.js file (models)
 ******* */

const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');
const Document = require('./document');

const User = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, 'name is required'],
    },
    lastname: {
      type: String,
      required: [true, 'name is required'],
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true,
      lowercase: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error({ error: 'Invalid Email address' });
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 7,
    },
    resetPasswordToken: {
      type: String,
      required: false,
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
    avatar: {
      type: String,
      required: false,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    completedProfil: {
      type: Boolean,
      required: true,
    },
    prospects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prospect',
      required: false,
    }],
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: false,
    },
    role: {
      type: String,
      enum: ['admin', 'restricted'],
      required: true,
    },
    document: {
      type: Document,
      required: true,
    },
    about: {
      type: String,
      required: false,
    },
    trainings: {
      type: [{
        refId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Training',
        },
        seen: {
          type: Boolean,
        },
        complete: {
          type: Boolean,
        },
        grade: {
          type: Number,
        },
        favorite: {
          type: Boolean,
        },
        stoppedAt: {
          type: Number,
        },
        enrolled: {
          type: Boolean,
        },
      }],
      required: false,
    },
    experience: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

User.pre('save', async function (next) {
  // Hash the password before saving the user model
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

User.methods.addProspect = async function (prospect) {
  // Add a prospect
  const user = this;

  user.prospects = user.prospects.concat(prospect);
  await user.save();
};

User.methods.generateAuthToken = async function () {
  // Generate an auth token for the user
  const user = this;

  const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

User.statics.findByCredentials = async (email, password) => {
  // Search for a user by email and password.
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error({ error: 'Invalid login credentials' });
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new Error({ error: 'Invalid login credentials' });
  }
  return user;
};

User.statics.findById = async (id) => {
  // Search for a user by id
  try {
    const user = await UserModel.findOne({ _id: id })
      .populate({ path: 'company' })
      .populate({ path: 'prospects' })
      .populate({ path: 'trainings.refId', populate: 'trainer' });
    if (!user) {
      throw new Error({ error: 'Invalid id' });
    }
    return user;
  } catch (e) {
    throw new Error(e);
  }
};

const UserModel = mongoose.model('User', User);
module.exports = UserModel;
