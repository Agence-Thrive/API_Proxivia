/** ******
* company.js file (controllers/api)
****** */

const express = require('express');
const companyService = require('../../services/company/company');

const router = express.Router();

router.get('/list', companyService.getAllCompanies);
router.get('/:id', companyService.getCompanyById);
router.post('/', companyService.createCompany);
router.put('/:id', companyService.updateCompanyById);
router.delete('/:id', companyService.deleteCompanyById);

module.exports = router;
