let responseMessages = require("../response/admin.response");
let adminModel = new (require("../model/admin.mysql"))();
const xml2js = require('xml2js');
const fileHelper = require('../../../helper/fileHelper.js')
const parser = new xml2js.Parser({
    explicitArray: true
});

module.exports = class adminService {
    
    async readAndGetRevenueCenter(path ,filter) {
        return await fileHelper.readFile(path,filter).then(async (data) => {
        if(data){
            return {
                status: true,
                saleItems: data.saleItems
            }
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
