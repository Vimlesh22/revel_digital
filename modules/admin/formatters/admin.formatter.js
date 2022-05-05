"use strict";
module.exports = class offerFormatter {
    getPath(req) {
        const params = {
            configExportPath: req.body.configExportPath,
            revenueCenterExportPath: req.body.revenueCenterExportPath,
            divisonExportPath: req.body.divisonExportPath

        }
        return params;
    }

}