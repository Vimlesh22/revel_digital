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
            const saleItemsArray = result['ConfigExport']['SaleItems'];
            const saleItems = {};
            if (result) {
                saleItems.saleItems = formatSalesItem(saleItemsArray[0]['SaleItem']);
                resolve(saleItems);
            } else {
                reject(err);
            }

        })
    })
}

const formatSalesItem = (saleItems) => {
    const saleItemsResult = [];
    for (let index = 0; index < saleItems.length; index++){
        const item = saleItems[index];
        let saleItemObj = {};
        if(item['Available'][0] === '1'){
            saleItemObj = {
                available: item['Available'][0],
                description: item['Description'][0],
                division: item['Division'][0],
                saleItemId: item['SaleItemId'][0],
            };
            saleItemObj.revenueCenters =  formatRevenueCenterDetails(item['RevenueCenter']);
        }
        saleItemsResult.push(saleItemObj);
    }
    return saleItemsResult;
}


const formatRevenueCenterDetails = (revenueCenter) => {
    const revenueCenterDetails  = [];
    for (let index = 0; index < revenueCenter.length; index++){
        const item = revenueCenter[index];
        const revenueObj = {
            id: item.attr.Id,
            name: item.attr.Name
        }
        revenueObj.priceList = getPriceList(item['ItemAvailabilityByMode'][0]['Mode'],item['PriceList'][0]['Price']);
        revenueCenterDetails.push(revenueObj);
    }
    return revenueCenterDetails;
}

const getPriceList =  (itemAvaialabilityByMode, priceList) => {
    let priceListResult = [];
    itemAvaialabilityByMode.filter(function (mode) {
        return priceList.some(function (pList) {
            if (mode['Available'][0] === '1' && mode.attr.Id === pList.attr.Mode) {
                priceListResult.push({
                    mode_id: mode.attr.Id,
                    mode_name: mode.attr.Name,
                    price: pList._
                })
            }
        });
    });
    return priceListResult;
}

module.exports = {
    readFile: readFile
}