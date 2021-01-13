/** ******
 * user.js file (services/users)
 ******* */

const nodemailer = require('nodemailer');
const base62 = require('base62-random');
const User = require('../../models/user');
const Utility = require('../utility/utility');

const getUsers = async (req, res) => {
  try {
    const isAdmin = await Utility.verifyToken(req.headers.authorization);
    if (isAdmin.role === 'restricted') {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not currently authorized to proccess this operation',
      });
    }
    const users = await User.find({});

    if (users.length > 0) {
      return res.status(200).json(users);
    }

    return res.status(404).json({
      code: 'BAD_REQUEST_ERROR',
      description: 'No users found in the system',
    });
  } catch (error) {
    Utility.printLogs(error);
    return res.status(500).json({
      code: 'SERVER_ERROR',
      description: 'something went wrong, Please try again',
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser || (String(actualUser._id) !== req.params.id && actualUser.role !== 'admin')) {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const user = await User.findById(req.params.id);
    if (user) {
      return res.status(200).json(user);
    }

    return res.status(404).json({
      code: 'BAD_REQUEST_ERROR',
      description: 'No users found in the system',
    });
  } catch (error) {
    Utility.printLogs(error);
    return res.status(500).json({
      code: 'SERVER_ERROR',
      description: 'something went wrong, Please try again',
    });
  }
};

const createUser = async (req, res) => {
  try {
    const docData = {
      name: req.body.firstname,
      age: 38,
      email: req.body.email,
      about: '',
    };
    const field = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      postal: req.body.postal,
      country: req.body.country,
      completedProfil: false,
      role: 'restricted',
      document: {
        viager: docData,
        juridique: docData,
        assurance: docData,
      },
    };

    for (const [key, value] of Object.entries(field)) {
      if ((value === undefined || value === '') && key !== 'about') {
        return res.status(422).json({
          code: 'REQUIRED_FIELD_MISSING',
          description: `${key} was undefined or empty`,
          field: key,
        });
      }
    }

    const isEmailExists = await User.findOne({
      email: field.email,
    });

    if (isEmailExists) {
      return res.status(409).json({
        code: 'ENTITY_ALREAY_EXISTS',
        description: 'email already exists',
        field: 'email',
      });
    }

    const newUser = await new User(field);
    await newUser.save();
    const token = await newUser.generateAuthToken();
    if (newUser) {
      return res.status(201).json({ newUser, token });
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

const updateUser = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser) {
      return res.status(404).json({
        code: 'BAD_REQUEST_ERROR',
        description: 'No users found in the system',
      });
    }
    if (actualUser.id !== req.params.id && actualUser.role !== 'admin') {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const userId = req.params.id;

    const field = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      postal: req.body.postal,
      country: req.body.country,
      about: req.body.about,
    };

    for (const [key, value] of Object.entries(field)) {
      if ((value === undefined || value === '') && key !== 'about') {
        return res.status(422).json({
          code: 'REQUIRED_FIELD_MISSING',
          description: `${key} was undefined or empty`,
          field: key,
        });
      }
    }

    const isUserExists = await User.findById(userId);

    if (!isUserExists) {
      return res.status(404).json({
        code: 'BAD_REQUEST_ERROR',
        description: 'No user found in the system',
      });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, field, {
      new: true,
    });

    if (updatedUser) {
      return res.status(200).json(updatedUser);
    }
    throw new Error('something went wrong');
  } catch (error) {
    Utility.printLogs(error);
    return res.status(500).json({
      code: 'SERVER_ERROR',
      description: 'something went wrong, Please try again',
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser) {
      return res.status(404).json({
        code: 'BAD_REQUEST_ERROR',
        description: 'No users found in the system',
      });
    }
    if (actualUser.id !== req.params.id && actualUser.role !== 'admin') {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        message: 'You are not allowed to perform this action',
      });
    }
    const user = await User.findByIdAndRemove(req.params.id);
    if (user) {
      return res.status(200).json({
        message: `User with id ${req.params.id} deleted successfully`,
      });
    }
    return res.status(404).json({
      code: 'BAD_REQUEST_ERROR',
      description: 'No users found in the system',
    });
  } catch (error) {
    Utility.printLogs(error);
    return res.status(500).json({
      code: 'SERVER_ERROR',
      description: 'Something went wrong, Please try again',
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        error: 'Wrong email or password',
      });
    }
    const token = await user.generateAuthToken();
    return res.status(200).send({ user, token });
  } catch (error) {
    Utility.printLogs(error);
    return res.status(500).send(error);
  }
};

const logoutUser = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);

    if (!actualUser) {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    const userToken = req.headers.authorization.split(' ')[1];
    for (const token in actualUser.tokens) {
      if (String(actualUser.tokens[token].token) === String(userToken)) {
        actualUser.tokens.splice(token, 1);
        break;
      }
    }
    await actualUser.save();
    return res.status(200).json();
  } catch (e) {
    Utility.printLogs(e);
    return res.status(500).json({
      code: 'SERVER_ERROR',
      description: 'Something went wrong. Please try again',
    });
  }
};

const getUserData = async (req, res) => {
  try {
    const user = await Utility.verifyToken(req.headers.authorization);
    if (!user) {
      return res.status(404).json({
        code: 'BAD_REQUEST_ERROR',
        message: 'No users found in the system',
      });
    }
    return res.status(200).json(user);
  } catch (e) {
    Utility.printLogs(e);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      description: e.message,
    });
  }
};

const updatePassword = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.header.authorization);
    if (!actualUser) {
      return res.status(404).json({
        code: 'BAD_REQUEST_ERROR',
        description: 'No users found in the system',
      });
    }
    const updatedUser = await User.findByIdAndUpdate(
      actualUser._id,
      { password: req.body.password },
      { new: true },
    );
    await updatedUser.save();
    if (updatedUser) {
      return res.status(200).json(updateUser);
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

const resetPassword = async (req, res) => {
  try {
    const userLost = await User.findOne({
      resetPasswordToken: req.body.resetPasswordToken,
    });
    if (!userLost) {
      return res.status(404).json({
        code: 'BAD_REQUEST_ERROR',
        description: 'Ressource not found',
      });
    }
    userLost.resetPasswordToken = '';
    userLost.password = req.body.newPassword;
    await userLost.save();
    return res.status(200).json(userLost);
  } catch (error) {
    Utility.printLogs(error);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      description: error.message,
    });
  }
};

const sendMailForgotPassword = async (req, res) => {
  try {
    const isUserExist = await User.findOne({ email: req.body.email });
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });
    let info;
    if (!isUserExist) {
      info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: 'bar@example.com, baz@example.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>', // html body
      });
    } else {
      const token = base62(12);
      isUserExist.resetPasswordToken = token;
      await isUserExist.save();
      info = await transporter.sendMail({
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: 'bar@example.com, baz@example.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: `voici le lien bouffon: https://localhost/api/v1/updatePassword/${token}`, // plain text body
        html: `<b>Cliquez sur le lien pour réinitialiser votre mot de passe</b><br><a href="https://localhost/api/v1/updatePassword/${token}">GO</a>`, // html body
      });
    }
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return res.status(200).json({
      code: 'EMAIL_SENT',
      description: 'email send to the address',
    });
  } catch (error) {
    Utility.printLogs(error);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      description: error.message,
    });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByCredentials(email, password);
    if (!user || user.role !== 'admin') {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        error: 'Wrong email or password',
      });
    }
    const token = await user.generateAuthToken();
    return res.status(200).json({ user, token });
  } catch (error) {
    Utility.printLogs(error);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      description: error.message,
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  getUserData,
  updatePassword,
  sendMailForgotPassword,
  resetPassword,
  adminLogin,
};
