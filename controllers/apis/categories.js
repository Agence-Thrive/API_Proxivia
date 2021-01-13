/** ******
* categories.js file (controllers/api)
****** */

const express = require('express');
const categoriesService = require('../../services/categories/categories');

const router = express.Router();

router.get('/list', categoriesService.getAllCategories);
router.get('/:id', categoriesService.getCategory);
router.post('/', categoriesService.createCategory);
router.put('/:id', categoriesService.updateCategory);
router.delete('/:id', categoriesService.deleteCategory);

module.exports = router;
