"use strict";
module.exports = class offerFormatter {
    getReqParams(req) {
        const params = {
            configExportPath: req.body.configExportPath,
            revenueCenterExportPath: req.body.revenueCenterExportPath,
            divisonExportPath: req.body.divisonExportPath,
            filter: req.body.filter

        }
        return params;
    }

}