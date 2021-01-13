/** ******
 * v1.js file (inside routes/apis)
 ******* */

const express = require('express');
const userController = require('../../controllers/apis/user');
const trainingController = require('../../controllers/apis/training');
const comapgnyController = require('../../controllers/apis/company');
const updateController = require('../../controllers/apis/update');
const trainerController = require('../../controllers/apis/trainer');
const categoriesController = require('../../controllers/apis/categories');

const router = express.Router();

router.use('/users', userController);
router.use('/training', trainingController);
router.use('/company', comapgnyController);
router.use('/update', updateController);
router.use('/trainer', trainerController);
router.use('/categories', categoriesController);
module.exports = router;
