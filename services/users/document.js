/** *******
* Document.js file (services/users)
******* */

const Utility = require('../utility/utility');

const updateDocumentById = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser) {
      return res.status(404).json({
        code: 'BAD_REQUEST_ERROR',
        description: 'No users found in the system',
      });
    }
    const documentToUpdate = req.body.docs;
    for (const [key, value] of Object.entries(documentToUpdate)) {
      actualUser.document[key] = value;
    }
    await actualUser.save();
    return res.status(200).json(documentToUpdate);
  } catch (e) {
    Utility.printLogs(e);
    return res.status(500).json({
      code: 'SERVER_ERROR',
      description: e.message,
    });
  }
};

const getFieldsOfDocument = async (req, res) => {
  try {
    const actualUser = await Utility.verifyToken(req.headers.authorization);
    if (!actualUser) {
      return res.status(401).json({
        code: 'NOT_ALLOWED',
        description: 'You are not allowed to perform this action',
      });
    }
    return res.status(200).json(actualUser.document[req.params.theme]);
  } catch (error) {
    Utility.printLogs(error);
    return res.status(500).json({
      code: 'INTERNAL_SERVER_ERROR',
      description: error.message,
    });
  }
};

module.exports = {
  updateDocumentById,
  getFieldsOfDocument,
};
