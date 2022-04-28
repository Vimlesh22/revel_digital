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
        let { path } = adminFormatter.getPath(req);
        if (path) {
            returnResponse = await adminService.readAndGetRevenueCenter(path);
        } else {
             //returns code and message in returnResponse variable
            returnResponse = responseMessages.validation_error;
            //Getting errors of validation and store in returnResponse variable
            returnResponse.errors = validation.errors.errors;
        }
        // return response to client request
        return res.json(returnResponse);
    }

    async getAllRevenueCenterController(req, res) {
        const returnResponse = await adminService.getAllRevenueCenterService();
        return res.json(returnResponse);
    }


}
