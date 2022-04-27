const fs = require("fs");
const xml2js = require('xml2js');
const parser = new xml2js.Parser({
    explicitArray: true,
    attrkey: 'attr'
});

const readFile = (path) => {
    const data = fs.readFileSync(path);
    return new Promise((resolve, reject) => {
        parser.parseStringPromise(data).then((result, err) => {
            if (result) {
                const salesItemData = formatSalesItem(result['ConfigExport']['SaleItems'][0]['SaleItem']);
                resolve(salesItemData);
            } else {
                reject(err);
            }

        })
    })
}

const formatSalesItem = (salesItem) => {
    const salesItemArray = [];
    const result = {};
    for (let index = 0; index < salesItem.length; index++) {
        const item = salesItem[index];
        result.saleItemId = item['SaleItemId'][0];
        result.description = item['Description'][0];
        result.available = item['Available'][0];
        item['RevenueCenter'].forEach(revenueCenter => {
            result.revenue_center_id = revenueCenter.attr['Id'];
            result.revenue_center_name = revenueCenter.attr['Name'];
            const itemAvaialabilityByMode = revenueCenter['ItemAvailabilityByMode'][0]['Mode'];
            const priceList = revenueCenter['PriceList'][0]['Price'];
            revenueCenter = getRevenueCenterDetails(itemAvaialabilityByMode, priceList, result);
            salesItemArray.push(revenueCenter);
        });
    }
    return salesItemArray;
}

const getRevenueCenterDetails = (configurationByMode, priceList, result) => {
    const actualResult = []
    configurationByMode.filter(function (mode) {
        return priceList.some(function (o2) {
            if (mode['Available'][0] === '1' && mode.attr.Id === o2.attr.Mode) {
                const modeResult = {
                    ...result,
                    mode_id: mode.attr.Id,
                    mode_name: mode.attr.Name,
                    price: o2._,
                    available: mode['Available'][0]
                }
                actualResult.push(modeResult)
            }
        });
    });
    return actualResult;
}

module.exports = {
    readFile: readFile
}