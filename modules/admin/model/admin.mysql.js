const path = require("path");
const dbconnection = require(path.join(global.appRoot + "/helper/dbconnection"));
module.exports = class AdminModel {
    
    async addSaleItem(data) {  
        for (let item of data) {
            var transactionQuery = "INSERT INTO revenuecenter SET ?";
            await dbconnection.executevaluesquery(transactionQuery, item);
        }
        return 1;
    }

    async getAllRevenueCenterModel() {
        var query = "SELECT * FROM revenuecenter"
        return await dbconnection.executevaluesquery(query, [])
    }

}