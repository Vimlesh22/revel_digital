let responseMessages = require("../response/admin.response");
const path = require("path");
const validator = require(path.join(global.appRoot + "/helper/client_api_validator.js"))
let adminModel = new (require("../model/admin.mysql"))();
var sha1 = require('sha1');
const moment = require('moment');
const xml2js = require('xml2js');
const fs = require('fs');
const fileHelper = require('../../../helper/fileHelper.js')
const parser = new xml2js.Parser({
    explicitArray: true
});

module.exports = class adminService {
    async login(form_data) {
        return adminModel.getAdmin(form_data)
            .then(async (users) => {
                if (users.length > 0) {
                    let email = sha1(form_data.email.toLowerCase());
                    let password = sha1(form_data.password)
                    if (email !== users[0].email) {
                        return responseMessages.failed("email_not_match");
                    }
                    if (password !== users[0].password) {
                        return responseMessages.failed("password_not_macth");
                    }
                    let send_response = {}
                    var token = await validator.create_client_token(form_data);
                    send_response.user_token = token;
                    return responseMessages.success("user_login_success", send_response);
                }
                else {
                    return responseMessages.failed("check_credential", "", form_data.lang_code);
                }
            })
            .catch((err) => {
                let error = (typeof err.errors != 'undefined') ? err.errors : err.message;
                return responseMessages.failed("something_went_wrong", "", form_data.lang_code);
            })
    }

    async readAndSaveXML(filePath) {
        const { path } = filePath;
        const data = fileHelper.readFile(path).then((data) => {
        adminModel.addSaleItem(data);
        });


    }
}
