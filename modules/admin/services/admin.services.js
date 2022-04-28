let responseMessages = require("../response/admin.response");
let adminModel = new (require("../model/admin.mysql"))();
const xml2js = require('xml2js');
const fileHelper = require('../../../helper/fileHelper.js')
const parser = new xml2js.Parser({
    explicitArray: true
});

module.exports = class adminService {
    
    async readAndSaveXML(filePath) {
        const { path } = filePath;
        return await fileHelper.readFile(path).then(async (data) => {
        const added = await adminModel.addSaleItem(data);
        if(added){
            return responseMessages.success("Revenue Centere Data Saved Successfully");
        }
        return responseMessages.failed("something_went_wrong", "", {});
        })
        .catch((err) => {
            let error = (typeof err.errors != 'undefined') ? err.errors : err.message;
            return responseMessages.failed("something_went_wrong", "", {});
        })
    }

    async getAllRevenueCenterService(){
        return adminModel.getAllRevenueCenterModel()
        .then(async (revenuecenter)=>{
            return responseMessages.success( revenuecenter);
        })
        .catch((err) => {
            let error = (typeof err.errors != 'undefined') ? err.errors : err.message;
            return responseMessages.failed("something_went_wrong", "", form_data.lang_code);
        })
    }
}
