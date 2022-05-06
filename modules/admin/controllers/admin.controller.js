"use strict";
let AdminService = require("../services/admin.services");
let adminService = new AdminService();
let adminFormatter = new (require('../formatters/admin.formatter'))();
let responseMessages = require("../response/admin.response");
module.exports = class AdminController {
    constructor() { }
    /**
     *
     * @param {*} req
     * @param {*} res
     * @returns {Promise<void>}
     */
    async readAndGetRevenueCenter(req, res) {
        // returnResponse variable use for returning data to client request
        let returnResponse = {}
        // Format request data
        let { configExportPath, revenueCenterExportPath, divisonExportPath } = adminFormatter.getPath(req);
        if (configExportPath && revenueCenterExportPath && divisonExportPath) {
            const filter = req.body.filter ? req.body.filter : null;
            returnResponse = await adminService.readAndGetRevenueCenter(configExportPath, revenueCenterExportPath, divisonExportPath , filter);
        } else {
            //returns code and message in returnResponse variable
            returnResponse = responseMessages.validation_error;
        }
        // return response to client request
        return res.json(returnResponse);
    }

}
