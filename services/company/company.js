/** ******
 * company.js file (services/company)
 ****** */

const Company = require('../../models/company');
const Utility = require('../utility/utility');
const UserModel = require('../../models/user');

const createCompany = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser) {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    if (actualUser.company) {
      return res.status(406).json({
        code: 'DUPLICATE_COMPANY',
        description: 'You already have a company',
      });
    }
    const field = {
      name: req.body.name,
      legalType: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      postcode: req.body.postcode,
      siret: req.body.siret,
      country: req.body.country,
      tva: req.body.tva,
      tCard: req.body.tCard,
      commercialChamber: req.body.commercialChamber,
      date: req.body.date,
      mendatoryParticulars: req.body.mendatoryParticulars,
      about: req.body.about,
      mediator: req.body.mediator,
      collaborators: [actualUser._id],
      avatar:
                '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',
      master: actualUser._id,
    };
    const newcompany = await new Company(field);
    await newcompany.save();
    if (newcompany) {
      actualUser.company = newcompany._id;
      await actualUser.save();
      return res.status(200).json(newcompany);
    }
    throw new Error('Something went wrong');
  } catch (e) {
    Utility.printLogs(e);
    return res.status(500).json({
      code: 'SERVER_ERROR',
      description: e,
    });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    const company = await Company.findById(req.params.id);
    if (!actualUser) {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    if (company) {
      for (const collaborator in company.collaborators) {
        if (String(company.collaborators[collaborator]) === String(actualUser._id)) {
          return res.status(200).json(company);
        }
      }
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    return res.status(404).json({
      code: 'BAD_REQUEST_ERROR',
      description: 'No company found with the id specified',
    });
  } catch (e) {
    Utility.printLogs(e);
    return res.status(500).json({
      code: 'SERVER_ERROR',
      description: e,
    });
  }
};

const updateCompanyById = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    const iscompanyExist = await Company.findById(req.params.id);
    if (!iscompanyExist) {
      return res.status(404).json({
        code: 'BAD_REQUEST_ERROR',
        description: 'No company found in system',
      });
    }
    if (!actualUser || String(actualUser._id) !== String(iscompanyExist.master)) {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const field = {
      name: req.body.name,
      legalType: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      postcode: req.body.postcode,
      country: req.body.country,
      siret: req.body.siret,
      tva: req.body.tva,
      tCard: req.body.tCard,
      commercialChamber: req.body.commercialChamber,
      date: req.body.date,
      mendatoryParticulars: req.body.mendatoryParticulars,
      about: req.body.about,
      mediator: req.body.mediator,
      avatar: req.body.avatar,
    };
    const updatedcompany = await Company.findByIdAndUpdate(
      req.params.id,
      field,
      { new: true },
    );
    if (updatedcompany) {
      return res.status(200).json(updatedcompany);
    }
    return res.status(401).json({
      code: 'NOT_ALLOWED',
      description: 'You are not allowed to perform this action',
    });
  } catch (e) {
    Utility.printLogs(e);
    return res.status(500).json({
      code: 'SERVER_ERROR',
      description: e,
    });
  }
};

const deleteCompanyById = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    const iscompanyExist = await Company.findById(req.params.id);

    if (!actualUser || !iscompanyExist || (String(actualUser._id) !== String(iscompanyExist.master) && actualUser.role !== 'admin')) {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    if (!iscompanyExist) {
      return res.status(404).json({
        code: 'BAD_REQUEST_SERVER',
        description: 'No company found with this id in the system',
      });
    }
    const company = await Company.findByIdAndRemove(req.params.id);
    if (company) {
      actualUser.company = null;
      await actualUser.save();
      return res.status(200).json({
        message: `company with id ${req.params.id} deleted successfully`,
      });
    }
    const usersCompany = await UserModel.find({ company: req.params.id });
    if (usersCompany) {
      for (const user in usersCompany) {
        /* eslint-disable no-await-in-loop */
        if (
          String(usersCompany[user].company) === String(req.params.id)
        ) {
          usersCompany[user].company = null;
          await usersCompany[user].save();
        }
        /* eslint-enable no-await-in-loop */
      }
    }
    return res.status(404).json({
      code: 'BAD_REQUEST_SERVER',
      description: 'No company found with this id in the system',
    });
  } catch (e) {
    Utility.printLogs(e);
    return res.status(500).json({
      code: 'SERVER_ERROR',
      description: 'Something went wrong, Please try again',
      message: e.message,
    });
  }
};

const getAllCompanies = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser || actualUser.role !== 'admin') {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const companies = await Company.find().populate({
      path: 'master',
      select: { firstname: 1, lastname: 1 },
    });
    if (companies < 1) {
      return res.status(404).json({
        code: 'BAD_REQUEST_ERROR',
        description: 'No companies found in the system',
      });
    }
    return res.status(200).json(companies);
  } catch (error) {
    Utility.printLogs(error);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      description: error.message,
    });
  }
};

module.exports = {
  createCompany,
  getCompanyById,
  updateCompanyById,
  deleteCompanyById,
  getAllCompanies,
};
