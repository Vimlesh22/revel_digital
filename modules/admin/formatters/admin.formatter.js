"use strict";
module.exports = class offerFormatter {
    getPath(req) {
        const path = {
            path : req.body.path
        }
        return path;
    }

}