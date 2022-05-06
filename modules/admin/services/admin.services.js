let responseMessages = require("../response/admin.response");
let adminModel = new (require("../model/admin.mysql"))();
const xml2js = require('xml2js');
const fileHelper = require('../../../helper/fileHelper.js')
const parser = new xml2js.Parser({
    explicitArray: true
});

module.exports = class adminService {
    
    async readAndGetRevenueCenter(configExportPath, revenueCenterExportPath, divisonExportPath , filter) {
        const configExportData = await fileHelper.readFile(configExportPath);
        const revenueCenterExportData = await fileHelper.readFile(revenueCenterExportPath);
        const divisionData =  await fileHelper.readFile(divisonExportPath);
        const saleItems = configExportData['ConfigExport']['SaleItems'];
        const revenueCenters = revenueCenterExportData['ConfigExport']['RevenueCenters'];
        const divisions = divisionData['ConfigExport']['Divisions'];
        const data = fileHelper.getBusinessDetails(saleItems, revenueCenters, divisions , filter);
        if(data){
            return {
                status: true,
                saleItems: data
            }
        }else {
            return responseMessages.failed("something_went_wrong", "", {}); 
        }
    }
}
