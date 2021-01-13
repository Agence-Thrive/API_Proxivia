/** ******
 * training.js file (models)
 ****** */

const mongoose = require('mongoose');

const TrainingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    trainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trainer',
      required: true,
    },
    subject: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['Débutant', 'Intermédiaire', 'Expert'],
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      required: true,
    },
    length: {
      type: Number,
      required: true,
    },
    grade: {
      type: {
        average: {
          type: Number,
        },
        totalGrade: {
          type: Number,
        },
      },
      required: true,
    },
    xpPoint: {
      type: Number,
      required: true,
    },
    details: {
      type: Object,
      required: true,
      chapter: {
        type: [
          {
            title: {
              type: String,
            },
            timecode: {
              type: String,
            },
            notion: {
              type: [String],
            },
          },
        ],
      },
    },
    ressources: {
      type: [String],
      required: false,
    },
    subscribers: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

TrainingSchema.statics.findByTitle = async (title) => {
  try {
    const training = await await TrainingModel.findOne({ title });
    if (!training) {
      throw new Error({ error: 'Invalid title' });
    }
    return training;
  } catch (e) {
    throw Error(e);
  }
};

TrainingSchema.statics.findByTrainer = async (trainer) => {
  try {
    const training = await TrainingModel.find({ trainer });
    if (!training) {
      throw new Error({ error: 'Invalid trainer' });
    }
    return training;
  } catch (e) {
    throw Error(e);
  }
};

TrainingSchema.statics.findByPopularity = async (offset, size) => {
  try {
    const training = await TrainingModel.find()
      .populate('trainer')
      .skip(offset)
      .limit(size)
      .sort({ views: -1 });
    return training;
  } catch (error) {
    throw new Error(error.message);
  }
};

TrainingSchema.statics.findByNewer = async (offset, size) => {
  try {
    const training = await TrainingModel.find()
      .populate('trainer')
      .skip(offset)
      .sort({ updatedAt: -1 })
      .limit(size);
    return training;
  } catch (e) {
    throw Error(e);
  }
};

const TrainingModel = mongoose.model('Training', TrainingSchema);
module.exports = TrainingModel;
