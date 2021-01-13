/** *******
* trainer.js file
****** */

const express = require('express');
const trainerService = require('../../services/training/trainer');

const router = express.Router();

router.post('/', trainerService.createTrainer);
router.get('/list', trainerService.getAllTrainers);
router.get('/:id', trainerService.getTrainer);
router.put('/:id', trainerService.updateTrainer);
router.delete('/:id', trainerService.deleteTrainer);

module.exports = router;
