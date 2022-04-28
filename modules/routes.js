const express = require('express');
var router = express.Router();
var path = require('path');
const AdminController = require('./admin/controllers/admin.controller');
let adminController = new AdminController();

router.post('/admin/readAndSaveXML', adminController.readAndSaveXML);
router.get('/admin/getAllRevenueCenter', adminController.getAllRevenueCenterController);




module.exports = router;