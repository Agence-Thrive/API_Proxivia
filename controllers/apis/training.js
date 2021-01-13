/** ******
 * training.js file (controllers/api)
******* */

const express = require('express');
const trainingService = require('../../services/training/training');

const router = express.Router();

router.post('/:id/enroll', trainingService.enrollForTraining);
router.post('/:id/grade', trainingService.addGrade);
router.post('/:id/seen', trainingService.seenTraining);
router.post('/:id/favorite', trainingService.addTrainingToFavorite);
router.post('/:id/complete', trainingService.completeTraining);
router.get('/trainer', trainingService.getTrainingByTrainer);
router.get('/subject', trainingService.getTrainingBySubject);
router.get('/title', trainingService.getTrainingByTitle);
router.get('/newer', trainingService.getTrainingByNewest);
router.get('/popular', trainingService.getTrainingByPopularity);
router.get('/:id', trainingService.getTrainingById);
router.post('/', trainingService.createTraining);
router.put('/:id', trainingService.updateTraining);
router.delete('/:id', trainingService.deleteTraining);

module.exports = router;
