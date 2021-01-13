/* *******
* prospect.js (service file)
******* */

const Prospect = require('../../models/prospect');
const User = require('../../models/user');
const Utility = require('../utility/utility');
const Company = require('../../models/company');

const getProspect = async (req, res) => {
  try {
    let found = 0;
    const actualUser = await Utility.verifyToken(req.headers.authorization);

    if (!actualUser || String(actualUser._id) !== req.params.id) {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You can not process to this action',
      });
    }
    for (const prospect in actualUser.prospects) {
      if (String(actualUser.prospects[prospect]._id) === req.params.prospectId) {
        found = 1;
        break;
      }
    }
    if (found === 0) {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const prospect = await Prospect.ProspectModel.findById(req.params.prospectId);
    if (prospect) {
      return res.status(200).json(prospect);
    }
    return res.status(404).json({
      code: 'BAD_REQUEST_ERROR',
      description: 'No prospect found with this id',
    });
  } catch (e) {
    Utility.printLogs(e);
    return res.status(500).json({
      code: 'SERVER_ERROR',
      description: e,
    });
  }
};

const addProspect = async (req, res) => {
  try {
    let progress;
    if (req.body.status === 'oui') {
      progress = 33;
    } else if (req.body.status === 'peut-être') {
      progress = 50;
    } else {
      progress = 100;
    }
    const actualUser = await Utility.verifyToken(req.headers.authorization);

    if (!actualUser) {
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
      address: req.body.address,
      city: req.body.city,
      postal: req.body.postal,
      country: req.body.country,
      age: req.body.age,
      houseValue: req.body.houseValue,
      commission: req.body.commission,
      area: req.body.area,
      status: req.body.status,
      master: actualUser._id,
      progress,
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
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        code: 'BAD_REQUEST_ERROR',
        description: 'No user found in the system',
      });
    }

    const newProspect = await new Prospect.ProspectModel(field);
    await newProspect.save();
    await user.addProspect(newProspect._id);
    return res.status(201).json(user);
  } catch (error) {
    Utility.printLogs(error);
    return res.status(500).json({
      code: 'SERVER_ERROR',
      description: error,
    });
  }
};

const updateProspect = async (req, res) => {
  try {
    let progress;
    if (req.body.status === 'oui') {
      progress = 33;
    } else if (req.body.status === 'peut-être') {
      progress = 50;
    } else {
      progress = 100;
    }
    let found = 0;
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser || String(actualUser._id) !== req.params.id) {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    for (const prospect in actualUser.prospects) {
      if (String(actualUser.prospects[prospect]._id) === req.params.prospectId) {
        found = 1;
        break;
      }
    }
    if (found === 0) {
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
      address: req.body.address,
      city: req.body.city,
      postal: req.body.postal,
      country: req.body.country,
      age: req.body.age,
      houseValue: req.body.houseValue,
      commission: req.body.commission,
      area: req.body.area,
      status: req.body.status,
      progress,
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

    const prospectToUpdate = await Prospect.ProspectModel.findByIdAndUpdate(req.params.prospectId,
      field, {
        new: true,
      });
    if (prospectToUpdate) {
      return res.status(200).json(prospectToUpdate);
    }
    throw Error('Something went wrong');
  } catch (e) {
    Utility.printLogs(e);
    return res.status(500).json({
      code: 'SERVER_ERROR',
      description: e,
    });
  }
};

const deleteProspect = async (req, res) => {
  try {
    let found = 0;
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser || String(actualUser._id) !== req.params.id) {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    for (const prospect in actualUser.prospects) {
      if (String(actualUser.prospects[prospect]._id) === req.params.prospectId) {
        found = 1;
        break;
      }
    }
    if (found === 0) {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const deletedProspect = await Prospect.ProspectModel.findByIdAndRemove(req.params.prospectId);
    if (deletedProspect) {
      const user = await User.findById(req.params.id);
      const index = user.prospects.findIndex((x) => String(x) === req.params.prospectId);
      delete user.prospects[index];
      await user.save();
      return res.status(200).json({
        description: 'Prospect deleted succesfully',
      });
    }
    return res.status(404).json({
      code: 'BAD_REQUEST_ERROR',
      description: 'something went wrong',
    });
  } catch (e) {
    Utility.printLogs(e);
    return res.status(500).json({
      code: 'SERVOR_ERROR',
      description: 'something went wrong, please try again',
    });
  }
};

const getProspectWon = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser || String(actualUser._id) !== req.params.id) {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const prospect = await Prospect.ProspectModel.findProspectWon();
    if (prospect > 0) {
      return res.status(200).json(prospect);
    }
    return res.status(404).json({
      code: 'BAD_REQUEST_ERROR',
      description: 'No prospect Found',
    });
  } catch (error) {
    Utility.printLogs(error);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      description: error.message,
    });
  }
};

const getProspectLost = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser || String(actualUser._id) !== req.params.id) {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const prospect = await Prospect.ProspectModel.findProspectLost();
    if (prospect > 0) {
      return res.status(200).json(prospect);
    }
    return res.status(404).json({
      code: 'BAD_REQUEST_ERROR',
      description: 'No prospect found',
    });
  } catch (error) {
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      description: error.message,
    });
  }
};

const getProspectByCompany = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    const company = await Company.findOne({ _id: req.params.companyId });
    if (!actualUser || String(actualUser._id) !== String(company.master)) {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const prospects = await Company.findOne({ _id: req.params.companyId }, { _id: 1 }).populate({ path: 'collaborators', select: { lastname: 1, firstname: 1 }, populate: { path: 'prospects' } });
    if (prospects < 1) {
      return res.status(404).json({
        code: 'BAD_REQUEST_ERROR',
        description: 'No prospects found in the system',
      });
    }
    return res.status(200).json(prospects);
  } catch (error) {
    Utility.printLogs(error);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      description: error.message,
    });
  }
};

const getAllProspects = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser || actualUser.role !== 'admin') {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const prospect = await Prospect.ProspectModel.find().populate(
      {
        path: 'master',
        select: {
          firstname: 1,
          lastname: 1,
        },
        populate: {
          path: 'company',
          select: {
            name: 1,
            collaborators: 1,
          },
          populate: {
            path: 'collaborators',
            select: {
              firstname: 1,
              lastname: 1,
            },
          },
        },
      },
    );
    if (prospect.length < 1) {
      return res.statsu(404).json({
        code: 'BAD_REQUEST_ERROR',
        description: 'No prospect found in the system',
      });
    }
    return res.status(200).json(prospect);
  } catch (error) {
    Utility.printLogs(error);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      description: error.message,
    });
  }
};

const switchProspect = async (req, res) => {
  try {
    let found = false;
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    const company = await Company.findOne({ _id: actualUser.company });
    const target = await User.findOne({ _id: req.body.targetId });
    const prospect = await Prospect.ProspectModel.findOne({ _id: req.body.prospectId });
    const from = await User.findOne({ _id: req.body.fromId });

    if ((!actualUser || !company || !target || !prospect || !from)
      || (actualUser.role !== 'admin' && String(company.master) !== String(actualUser._id))) {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    if (target._id === from._id) {
      return res.status(403).json({
        code: 'FORBIDDEN',
        description: 'you can\'t switch prospects with the same user',
      });
    }
    target.prospects.forEach((e) => {
      if (String(e) === String(req.body.prospectId)) {
        return res.status(403).json({
          code: 'FORBIDDEN',
          description: 'Target already has the prospect',
        });
      }
    });
    from.prospects.forEach((e) => {
      if (String(e) === String(req.body.prospectId)) {
        found = true;
      }
    });
    if (!found) {
      return res.status(403).json({
        code: 'FORBIDDEN',
        description: 'Sender is not the master of the prospect',
      });
    }
    from.prospects = from.prospects.filter((e) => String(e) !== String(req.body.prospectId));
    target.prospects.push(req.body.prospectId);
    prospect.master = req.body.targetId;
    from.save();
    target.save();
    prospect.save();
    if (from && target && prospect) {
      return res.status(200).json(prospect);
    }
    throw new Error('Something went wrong, please try again');
  } catch (error) {
    Utility.printLogs(error);
    res.status(500).json({
      code: 'INTERNAL_ERROR_SERVER',
      description: error.message,
    });
  }
};

module.exports = {
  getProspect,
  addProspect,
  updateProspect,
  deleteProspect,
  getProspectWon,
  getProspectLost,
  getAllProspects,
  getProspectByCompany,
  switchProspect,
};
