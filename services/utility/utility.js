/** ******
* utility.js file (models)
******* */

const fs = require('fs');
const util = require('util');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

const verifyToken = async (jtoken) => {
  try {
    if (jtoken === undefined) {
      return null;
    }
    const token = jtoken.split(' ');
    const decoded = jwt.verify(token[1], process.env.JWT_KEY);
    const user = await User.findById(decoded);
    return (user);
  } catch (e) {
    throw new Error(e.message);
  }
};

const printLogs = async (message) => {
  const logFile = fs.createWriteStream('./api_logs.txt', { flags: 'a' });

  logFile.write(`${message}\n`);
};

module.exports = {
  verifyToken,
  printLogs,
};
