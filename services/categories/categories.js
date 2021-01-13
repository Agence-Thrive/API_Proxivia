/** ******
* categories.js file (service)
****** */

const Categories = require('../../models/categories');
const Utility = require('../utility/utility');

const createCategory = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser || actualUser.role !== 'admin') {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform thias action',
      });
    }
    const { name } = req.body;
    if (name === null || name === '') {
      return res.status(403).json({
        code: 'FORBIDDEN',
        description: 'Name field can\'t be null or empty',
      });
    }
    const newCategory = await new Categories(name);
    await newCategory.save();
    if (newCategory) {
      return res.status(200).json(newCategory);
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

const getCategory = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser || actualUser.role !== 'admin') {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const category = await Categories.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        code: 'BAD_REQUEST_ERROR',
        description: 'No category found in the server',
      });
    }
    return res.status(200).json(category);
  } catch (error) {
    Utility.printLogs(error);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      description: error.message,
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser || actualUser.role !== 'admin') {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const category = await Categories.find();
    if (category.length < 1) {
      return res.status(404).json({
        code: 'BAD_REQUEST_ERROR',
        description: 'No categories found in the system',
      });
    }
    if (category) {
      return res.statsu(200).json(category);
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

const updateCategory = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser || actualUser.role !== 'admin') {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const { name } = req.body;
    if (name === null || name === '') {
      return res.status(403).json({
        code: 'FORBIDDEN',
        description: 'Namr field can\'t be null or empty',
      });
    }
    const updatedCategory = await Categories.findByIdAndUpdate(req.params.id, { name }, { new: true });
    if (updatedCategory) {
      return res.status(200).json(updatedCategory);
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

const deleteCategory = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser || actualUser.role !== 'admin') {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const category = await Categories.findByIdAndRemove(req.params.id);
    if (category) {
      return res.status(200).json({
        description: `Category with id ${req.params.id} deleted successfully`,
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
  createCategory,
  getCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
