/** *******
* update.js file (services/update)
******* */

const Update = require('../../models/update');
const Utility = require('../utility/utility');

const createUpdate = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser || actualUser.role !== 'admin') {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const field = {
      functionnality: req.body.functionnality,
      object: req.body.object,
      status: req.body.status,
      disponibility: req.body.disponibility,
      releaseDate: req.body.releaseDate,
      details: req.body.details,
    };
    const newUpdate = await new Update(field);
    await newUpdate.save();
    if (newUpdate) {
      return res.status(200).json(newUpdate);
    }
    throw new Error('Something went wrong, please try again');
  } catch (error) {
    Utility.printLogs(error);
    return res.state(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      description: error.message,
    });
  }
};

const getUpdate = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser || actualUser.role !== 'admin') {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const update = Update.findById(req.params.id);
    if (update) {
      return res.status(200).json(update);
    }
    throw new Error('Something went wrong, please try again');
  } catch (error) {
    Utility.printLogs(error);
    return res.status(200).json({
      code: 'INTERNAL_SERVER_ERROR',
      description: error.message,
    });
  }
};

const updateUpdate = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser || actualUser.role !== 'admin') {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const field = {
      functionnality: req.body.functionnality,
      object: req.body.object,
      status: req.body.status,
      disponibility: req.body.disponibility,
      releaseDate: req.body.releaseDate,
      details: req.body.details,
    };
    const updatedUpdate = await Update.findByIdAndUpdate(req.params.id, field, { new: true });
    if (updatedUpdate) {
      return res.status(200).json(updatedUpdate);
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

const deleteUpdate = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser || actualUser.role !== 'admin') {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perfiorm this action',
      });
    }
    const deletedUpdate = await Update.findByIdAndRemove(req.params.id);
    if (deletedUpdate) {
      return res.status(200).json(deletedUpdate);
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

const getAllUpdates = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser || actualUser.role !== 'admin') {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const updates = await Update.find().populate('functionnality');
    if (updates.length < 1 || !updates) {
      return res.status(404).json({
        code: 'BAD_REQUES_ERROR',
        description: 'No update found in the system',
      });
    }
    return res.status(200).json(updates);
  } catch (error) {
    Utility.printLogs(error);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      description: error.message,
    });
  }
};

module.exports = {
  createUpdate,
  getUpdate,
  updateUpdate,
  deleteUpdate,
  getAllUpdates,
};
