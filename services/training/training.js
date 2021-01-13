/** ******
 * training.js file (services/training)
 ******* */

const Training = require('../../models/training');
const Utility = require('../utility/utility');
const Trainer = require('../../models/trainer');

const getTrainingById = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser) {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const training = await await Training.findById(req.params.id).populate(
      'trainer',
    );
    if (training) {
      training.views += 1;
      const trainer = await Trainer.findById(training.trainer);
      if (trainer) {
        trainer.addViews();
      }
      training.save();
      return res.status(200).json(training);
    }
    return res.status(404).json({
      code: 'BAD_REQUEST_ERROR',
      description: 'No training found with the id specified',
    });
  } catch (e) {
    Utility.printLogs(e);
    return res.status(500).json({
      code: 'SERVER_ERROR',
      description: e,
    });
  }
};

const getTrainingByTrainer = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser) {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const training = await Training.findByTrainer(req.body.trainer);
    if (training.length > 0) {
      return res.status(200).json(training);
    }
    return res.status(404).json({
      code: 'BAD_REQUEST_ERROR',
      description: 'No training found with the trainer specified',
    });
  } catch (e) {
    Utility.printLogs(e);
    return res.status(500).json({
      code: 'SERVER_ERROR',
      description: e,
    });
  }
};

const getTrainingBySubject = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser) {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const training = await Training.find({ subject: req.body.subject });
    if (training.lenght > 0) {
      return res.status(200).json(training);
    }
    return res.status(404).json({
      code: 'BAD_REQUEST_ERROR',
      description: `No training found with the subject ${req.body.subject}`,
    });
  } catch (e) {
    Utility.printLogs(e);
    return res.status(500).json({
      code: 'SERVER_ERROR',
      description: 'something went wrong, Please try again',
    });
  }
};

const getTrainingByTitle = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser) {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const training = await Training.find({ title: req.body.title });
    if (training.lenght > 0) {
      return res.status(200).json(training);
    }
    return res.status(404).json({
      code: 'BAD_REQUEST_ERROR',
      description: `No training found with the title ${req.body.title}`,
    });
  } catch (e) {
    Utility.printLogs(e);
    return res.status(500).json({
      code: 'SERVER_ERROR',
      description: 'something went wrong, Please try again',
    });
  }
};

const getTrainingByNewest = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser) {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const training = await Training.findByNewer(
      req.body.offset,
      req.body.size,
    );
    if (training.length > 0) {
      return res.status(200).json(training);
    }
    return res.status(404).json({
      code: 'BAD_REQUEST_ERROR',
      description: 'No training found',
    });
  } catch (e) {
    Utility.printLogs(e);
    return res.status(500).json({
      code: 'SERVER_ERROR',
      description: 'something went wrong, Please try again',
    });
  }
};

const getTrainingByPopularity = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser) {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const training = await Training.findByPopularity(
      Number(req.query.offset),
      Number(req.query.size),
    );
    if (training.length > 0) {
      return res.status(200).json(training);
    }
    return res.status(404).json({
      code: 'BAD_REQUEST_ERROR',
      description: 'No training found',
    });
  } catch (error) {
    Utility.printLogs(error);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      description: error.message,
    });
  }
};

const createTraining = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser || actualUser.role === 'restricted') {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        message: 'You are not allowed to perform this action',
      });
    }
    const field = {
      title: req.body.title,
      trainer: req.body.trainer,
      subject: req.body.subject,
      description: req.body.description,
      url: req.body.url,
      difficulty: req.body.difficulty,
      image: req.body.image,
      views: Math.round(Math.random() * (500 - 150) + 150),
      length: req.body.length,
      grade: 5,
      xpPoint: req.body.xpPoint,
      details: req.body.details,
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

    const newTraining = await new Training(field);
    await newTraining.save();
    if (newTraining) {
      const trainer = await Trainer.findById(newTraining.trainer);
      if (trainer) {
        trainer.addTraining();
      }
      return res.status(201).json(newTraining);
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

const updateTraining = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser || actualUser.role === 'restricted') {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const field = {
      title: req.body.title,
      trainer: req.body.trainer,
      subject: req.body.subject,
      description: req.body.description,
      url: req.body.url,
      difficulty: req.body.difficulty,
      image: req.body.image,
      length: req.body.length,
      grade: 5,
      xpPoint: req.body.xpPoint,
      details: req.body.details,
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

    const isTrainingExists = await Training.findById(req.params.id);

    if (!isTrainingExists) {
      return res.status(404).json({
        code: 'BAD_REQUEST_ERROR',
        description: 'No training found in the system',
      });
    }

    const updatedTraining = await Training.findByIdAndUpdate(
      req.params.id,
      field,
      { new: true },
    );
    if (updatedTraining) {
      return res.status(200).json(updatedTraining);
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

const deleteTraining = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser || actualUser.role === 'restricted') {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        message: 'You are not allowed to perform this action',
      });
    }
    const training = await Training.findByIdAndRemove(req.params.id);
    if (training) {
      return res.status(200).json({
        message: `Training with id ${req.params.id} deleted successfully`,
      });
    }
    return res.status(404).json({
      code: 'BAD_REQUEST_ERROR',
      description: 'No training found in the system',
    });
  } catch (e) {
    Utility.printLogs(e);
    return res.status(500).json({
      code: 'SERVER_ERROR',
      description: 'somethin went wrong, Please try again',
    });
  }
};

const enrollForTraining = async (req, res) => {
  try {
    let found = false;
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser) {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this actif',
      });
    }
    for (const training in actualUser.trainings) {
      if (actualUser.trainings[training].refId && String(actualUser.trainings[training].refId._id) === req.params.id) {
        actualUser.trainings[training].enrolled = req.body.enroll;
        await actualUser.save();
        found = true;
      }
    }
    if (found) {
      return res.status(200).json(actualUser);
    }
    const field = {
      refId: req.params.id,
      seen: true,
      complete: false,
      grade: null,
      favorite: false,
      stoppedAt: 0,
      enrolled: req.body.enroll,
    };
    actualUser.trainings = actualUser.trainings.concat(field);
    actualUser.save();
    return res.status(200).json(actualUser);
  } catch (error) {
    Utility.printLogs(error);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      description: error.message,
    });
  }
};

const addGrade = async (req, res) => {
  try {
    let found = false;
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser) {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this actif',
      });
    }
    for (const training in actualUser.trainings) {
      if (actualUser.trainings[training].refId && String(actualUser.trainings[training].refId._id) === req.params.id) {
        actualUser.trainings[training].grade = req.body.grade;
        await actualUser.save();
        found = true;
      }
    }
    if (found) {
      return res.status(200).json(actualUser);
    }
    const field = {
      refId: req.params.id,
      seen: true,
      complete: false,
      grade: req.body.grade,
      favorite: false,
      stoppedAt: 0,
      enrolled: false,
    };
    actualUser.trainings = actualUser.trainings.concat(field);
    actualUser.save();
    return res.status(200).json(actualUser);
  } catch (error) {
    Utility.printLogs(error);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      description: error.message,
    });
  }
};

const seenTraining = async (req, res) => {
  try {
    let found = false;
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser) {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this actif',
      });
    }
    for (const training in actualUser.trainings) {
      if (actualUser.trainings[training].refId && String(actualUser.trainings[training].refId._id) === req.params.id) {
        actualUser.trainings[training].seen = true;
        await actualUser.save();
        found = true;
      }
    }
    if (found) {
      return res.status(200).json(actualUser);
    }
    const field = {
      refId: req.params.id,
      seen: true,
      complete: false,
      grade: null,
      favorite: false,
      stoppedAt: 0,
      enrolled: false,
    };
    actualUser.trainings = actualUser.trainings.concat(field);
    actualUser.save();
    return res.status(200).json(actualUser);
  } catch (error) {
    Utility.printLogs(error);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      description: error.message,
    });
  }
};

const addTrainingToFavorite = async (req, res) => {
  try {
    let found = false;
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser) {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this actif',
      });
    }
    for (const training in actualUser.trainings) {
      if (actualUser.trainings[training].refId && String(actualUser.trainings[training].refId._id) === req.params.id) {
        actualUser.trainings[training].favorite = req.body.favorite;
        await actualUser.save();
        found = true;
      }
    }
    if (found) {
      return res.status(200).json(actualUser);
    }
    const field = {
      refId: req.params.id,
      seen: false,
      complete: false,
      grade: null,
      favorite: true,
      stoppedAt: 0,
      enrolled: false,
    };
    actualUser.trainings = actualUser.trainings.concat(field);
    actualUser.save();
    return res.status(200).json(actualUser);
  } catch (error) {
    Utility.printLogs(error);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      description: error.message,
    });
  }
};

const completeTraining = async (req, res) => {
  try {
    let found = false;
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser) {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this actif',
      });
    }
    for (const training in actualUser.trainings) {
      if (actualUser.trainings[training].refId && String(actualUser.trainings[training].refId._id) === req.params.id) {
        actualUser.trainings[training].complete = true;
        await actualUser.save();
        found = true;
      }
    }
    if (found) {
      return res.status(200).json(actualUser);
    }
    const field = {
      refId: req.params.id,
      seen: true,
      complete: true,
      grade: null,
      favorite: false,
      stoppedAt: 0,
      enrolled: false,
    };
    actualUser.trainings = actualUser.trainings.concat(field);
    actualUser.save();
    return res.status(200).json(actualUser);
  } catch (error) {
    Utility.printLogs(error);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      description: error.message,
    });
  }
};

module.exports = {
  getTrainingById,
  getTrainingByTrainer,
  getTrainingBySubject,
  getTrainingByTitle,
  getTrainingByNewest,
  getTrainingByPopularity,
  createTraining,
  updateTraining,
  deleteTraining,
  enrollForTraining,
  addGrade,
  seenTraining,
  addTrainingToFavorite,
  completeTraining,
};
