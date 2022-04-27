const path = require("path");
const dbconnection = require(path.join(global.appRoot + "/helper/dbconnection"));
module.exports = class AdminModel {
    async getAdmin() {
        var query = "SELECT * FROM admin_user"
        return await dbconnection.executevaluesquery(query, [])
    }

    async addSaleItem(data) {
        const insert_columns = Object.keys(data[0]);
        const insert_data = data.reduce((a, i) => [...a, Object.values(i)], []);

        await dbconnection.executevaluesquery('INSERT INTO RevenueCenter (??) VALUES ?', [insert_columns, insert_data], (error, data) => {
            console.log(data);
        })
        // for (let item of SaleItems) {
        //     var transactionQuery = "INSERT INTO `sales` (`sale_item_id`,`alt_item_id`,`description`,`division`,`available`,`bar_code`,`plu`,`function_revenue`) VALUES (?,?,?,?,?,?,?,?)";
        //     await dbconnection.executevaluesquery(transactionQuery, [item.SaleItemId, item.AltItemId, item.Description, item.Division, item.Available, item.BarCode, item.Plu.Id, item['Function']['_@ttribute']]);
        //     count++;
        // }
    }

    async getAllSalesItem() {
        var query = "SELECT * FROM RevenueCeter"
        return await dbconnection.executevaluesquery(query, [])
    }

}