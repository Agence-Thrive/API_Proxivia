/** *******
* trainer.js file (services/trainer)
****** */

const Trainer = require('../../models/trainer');
const Utility = require('../utility/utility');

const createTrainer = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser || actualUser.role !== 'admin') {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const field = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
      photo: req.body.photo,
      about: req.body.about,
      totalTraining: 0,
      totalViews: 0,
      totalArticle: 0,
    };
    const newTrainer = await new Trainer(field);
    await newTrainer.save();
    if (newTrainer) {
      return res.status(200).json(newTrainer);
    }
    throw new Error('Something went wrong, please try again');
  } catch (error) {
    Utility.printLogs(error);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      description: error.message,
    });
  }
};

const getTrainer = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser) {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const trainer = await Trainer.findById(req.params.id);
    if (trainer) {
      return res.status(200).json(trainer);
    }
    throw new Error('Something went wrong, please try again');
  } catch (error) {
    Utility.printLogs(error);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      description: error.message,
    });
  }
};

const getAllTrainers = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser || actualUser.role !== 'admin') {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const trainers = await Trainer.find();
    if (trainers.length <= 0) {
      return res.status(404).json({
        code: 'BAD_ERROR_REQUEST',
        description: 'No trainer found in the system',
      });
    }
    return res.status(200).json(trainers);
  } catch (error) {
    Utility.printLogs(error);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      description: error.message,
    });
  }
};

const updateTrainer = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser || actualUser.role !== 'admin') {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const field = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
      photo: req.body.photo,
      about: req.body.about,
    };

    for (const [key, value] of Object.entries(field)) {
      if (value === undefined || value === '') {
        return res.status(422).json({
          code: 'REQUIRED_FIELD_MISSING',
          description: `${key} was undefined or empty`,
          field: key,
        });
      }
    }
    const isTrainerExist = await Trainer.findById(req.params.id);

    if (!isTrainerExist) {
      return res.status(404).json({
        code: 'BAD_REQUEST_ERROR',
        description: 'No trainer found in the system',
      });
    }
    const updatedTrainer = await Trainer.findByIdAndUpdate(req.params.id, field, { new: true });
    if (updatedTrainer) {
      return res.status(200).json(updatedTrainer);
    }
    throw new Error('something went wrong');
  } catch (error) {
    Utility.printLogs(error);
    return res.status(500).json({
      code: 'SERVER_ERROR',
      description: error,
    });
  }
};

const deleteTrainer = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser || actualUser.role !== 'admin') {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const trainer = await Trainer.findByIdAndRemove(req.params.id);
    if (trainer) {
      return res.status(200).json({
        description: `Trainer with id ${req.params.id} deleted successfully`,
      });
    }
    throw new Error('Something went wrong, please try again');
  } catch (error) {
    Utility.printLogs(error);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      description: error.message,
    });
  }
};

module.exports = {
  createTrainer,
  getTrainer,
  updateTrainer,
  deleteTrainer,
  getAllTrainers,
};
