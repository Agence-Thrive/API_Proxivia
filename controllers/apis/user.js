/** ******
 * user.js file (controllers/apis)
 ******* */

const express = require('express');
const userService = require('../../services/users/user');
const prospectService = require('../../services/prospects/prospect');
const documentService = require('../../services/users/document');

const router = express.Router();

router.post('/switchProspect', prospectService.switchProspect);

router.post('/forgotpassword', userService.sendMailForgotPassword);

router.put('/resetpassword', userService.resetPassword);

router.get('/prospects/list', prospectService.getAllProspects);

router.get('/prospects/:companyId/list', prospectService.getProspectByCompany);

router.get('/document/:theme', documentService.getFieldsOfDocument);

router.post('/admin/login', userService.adminLogin);

router.get('/', userService.getUsers);

router.get('/profile', userService.getUserData);

router.post('/login', userService.loginUser);

router.post('/logout', userService.logoutUser);

router.get('/:id', userService.getUserById);

router.post('/', userService.createUser);

router.put('/document', documentService.updateDocumentById);

router.put('/:id', userService.updateUser);

router.delete('/:id', userService.deleteUser);

router.get('/:id/prospect/:prospectId', prospectService.getProspect);

router.post('/:id/prospect/', prospectService.addProspect);

router.put('/:id/prospect/:prospectId', prospectService.updateProspect);

router.delete('/:id/prospect/:prospectId', prospectService.deleteProspect);

module.exports = router;
