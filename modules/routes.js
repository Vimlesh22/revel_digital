const express = require('express');
var router = express.Router();
var path = require('path');
const AdminController = require('./admin/controllers/admin.controller');
let adminController = new AdminController();

router.post('/admin/readAndGetRevenueCenter', adminController.readAndGetRevenueCenter);




module.exports = router;