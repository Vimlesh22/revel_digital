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
                resolve(result);
            } else {
                reject(err);
            }

        })
    })
}

const getRevenueDetails = (saleItems, revenueCenters, divisons, filter) => {
    const saleItemDetails = formatSaleItem(saleItems[0]['SaleItem']);
    const revenueCenterDetails = formatRevenueCenter(revenueCenters[0]['RevenueCenter']);
    const divisonsDetails = formatDivisions(divisons[0]['Division']);
    const result = getFinalRevenueDetails(saleItemDetails, revenueCenterDetails, divisonsDetails, filter);
    return result;

}

const formatSaleItem = (saleItems) => {
    const saleItemsResult = [];
    for (let index = 0; index < saleItems.length; index++) {
        const item = saleItems[index];
        let saleItemObj = {};
        if (item['Available'][0] === '1') {
            saleItemObj = {
                available: item['Available'][0],
                description: item['Description'][0],
                divisionId: item['Division'][0],
                saleItemId: item['SaleItemId'][0],
            };
            saleItemObj.revenueCenters = formatRevenueCenterDetails(item['RevenueCenter']);
        }
        saleItemsResult.push(saleItemObj);
    }
    return saleItemsResult;
}

const formatRevenueCenter = (revenueCenters) => {
    const result = {};
    for (let index = 0; index < revenueCenters.length; index++) {
        const item = revenueCenters[index];
        result[item.attr['Id']] = {
            restaurantName: item['Configuration'][0]['RestaurantInfo'][0]['RestaurantName'][0]
        };
    }
    return result;
}

const formatDivisions = (divisions) => {
    const result = {};
    for (let index = 0; index < divisions.length; index++) {
        const item = divisions[index];
        result[item.attr['Id']] = {
            divisionDescription: item['Description'][0]
        };
    }
    return result;
}

const getFinalRevenueDetails = (saleItemDetails, revenueCenterDetails, divisonsDetails, filter) => {
    let finalResult = [];
    for (let index = 0; index < saleItemDetails.length; index++) {
        const saleItem = saleItemDetails[index];
        if (divisonsDetails[saleItem.divisionId])
            saleItem.divisionDescription = divisonsDetails[saleItem.divisionId].divisionDescription;
        if (revenueCenterDetails[saleItem.saleItemId])
            saleItem.restaurantName = revenueCenterDetails[saleItem.saleItemId].restaurantName;

        finalResult.push(saleItem);
    }

    let filteredResult = [];
    if (filter.saleItemIds && filter.saleItemIds.length > 0 && filter.divisionIds && filter.divisionIds.length > 0 && filter.revenueCenterIds && filter.revenueCenterIds.length > 0) {
        let filteredRevenueCenter = [];
        filteredResult = finalResult.filter(item => {
            item.revenueCenter.forEach(revenue => {
                if (filter.saleItemIds.includes(item.saleItemId) && filter.divisionIds.includes(item.divisionId) && filter.revenueCenterIds.includes(revenue.id)) {
                    filteredRevenueCenter.push(revenue);
                }
                return false;
            });

        })
        return finalResult = filteredResult;
    }

    //Filter by SaleItems and RevenueCenters
    if(filter.saleItemIds && filter.saleItemIds.length > 0 && filter.revenueCenterIds && filter.revenueCenterIds.length > 0){
        let filteredSaleResult = finalResult.filter((item) => filter.saleItemIds.includes(item.saleItemId));
        let result = [];
        filteredSaleResult.forEach(item => {
            item.revenueCenters = filterRevenueCenter(item.revenueCenters,filter.revenueCenterIds);
            result.push(item);
        })
        return finalResult = result;
    }
    //Filter By SaleItems and Division
    if (filter.saleItemIds && filter.saleItemIds.length > 0 && filter.divisionIds && filter.divisionIds.length > 0) {
        filteredResult = finalResult.filter(item => {
            if (filter.saleItemIds.includes(item.saleItemId) && filter.divisionIds.includes(item.divisionId)) {
                return true;
            }
            return false;
        })
        return finalResult = filteredResult;
    }
    //Filter By Only SaleItems
    if (filter.saleItemIds && filter.saleItemIds.length > 0) {
        filteredResult = finalResult.filter((item) => filter.saleItemIds.includes(item.saleItemId));
        finalResult = filteredResult;
    }
    //Filter By Only Divisons
    if (filter.divisionIds && filter.divisionIds.length > 0) {
        filteredResult = finalResult.filter((item) => filter.divisionIds.includes(item.divisionId));
        finalResult = filteredResult;
    }
    //Filter By Only Revenue Centers
    if (filter.revenueCenterIds && filter.revenueCenterIds.length > 0) {
        let result = [];
        finalResult.forEach(item => {
            item.revenueCenters = filterRevenueCenter(item.revenueCenters,filter.revenueCenterIds);
            result.push(item);
        })
        finalResult = result;
    }

    return finalResult;

}

const filterBasedOnInputs = (filter,finalResult) => {

}


const formatRevenueCenterDetails = (revenueCenter) => {
    const revenueCenterDetails = [];
    for (let index = 0; index < revenueCenter.length; index++) {
        const item = revenueCenter[index];
        const revenueObj = {
            id: item.attr.Id,
            name: item.attr.Name
        }
        revenueObj.priceList = getPriceList(item['ItemAvailabilityByMode'][0]['Mode'], item['PriceList'][0]['Price']);
        revenueCenterDetails.push(revenueObj);
    }
    return revenueCenterDetails;
}

const filterRevenueCenter = (revenueCenters, revenueCenterIds) => {
    let filteredCenter = [];
    revenueCenters.filter(center => {
        if (revenueCenterIds.includes(center.id)) {
            filteredCenter.push(center);
            return true;
        }
        return false;
    });
    return filteredCenter;
}

const getPriceList = (itemAvaialabilityByMode, priceList) => {
    let priceListResult = [];
    itemAvaialabilityByMode.filter(function (mode) {
        return priceList.some(function (pList) {
            if (mode['Available'][0] === '1' && mode.attr.Id === pList.attr.Mode) {
                priceListResult.push({
                    modeId: mode.attr.Id,
                    modeName: mode.attr.Name,
                    price: pList._
                })
            }
        });
    });
    return priceListResult;
}

module.exports = {
    readFile: readFile,
    getRevenueDetails: getRevenueDetails

}