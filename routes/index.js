/** ********
 * index.js file (for routes)
 ********* */

const apiRoute = require('./apis');
const Utility = require('../services/utility/utility');

const init = (server) => {
  server.get('*', (req, res, next) => {
    Utility.printLogs(`Request was made to: ${req.originalUrl}`);
    console.log(`Request was made to: ${req.originalUrl}`);
    return next();
  });

  server.use('/api', apiRoute);
};
module.exports = {
  init,
};
