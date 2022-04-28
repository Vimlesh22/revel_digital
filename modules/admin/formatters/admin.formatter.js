"use strict";
module.exports = class offerFormatter {
    getPath(req) {
        const params = {
            path : req.body.path
        }
        return params;
    }

}