/** ******
* update.js file (controllers/api)
****** */

const express = require('express');
const updateService = require('../../services/update/update');

const router = express.Router();

router.get('/list', updateService.getAllUpdates);
router.get('/:id', updateService.getUpdate);
router.post('/', updateService.createUpdate);
router.put('/:id', updateService.updateUpdate);
router.delete('/:id', updateService.deleteUpdate);

module.exports = router;
