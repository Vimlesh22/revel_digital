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
            return result ? resolve(result): reject(err);
        })
    })
}

const getBusinessDetails = (saleItems, revenueCenters, divisons, filter) => {
    const saleItemDetails = formatSaleItem(saleItems[0]['SaleItem']);
    const revenueCenterDetails = formatRevenueCenter(revenueCenters[0]['RevenueCenter']);
    const divisonsDetails = formatDivisions(divisons[0]['Division']);
    return getFinalRevenueDetails(saleItemDetails, revenueCenterDetails, divisonsDetails, filter);
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

    return filter !== null ? filterBasedOnInputs(filter, finalResult) : finalResult;

}

const filterBasedOnInputs = (filter, finalResult) => {
    //Filter by SaleItems, Division, RevenueCenter and Mode
    if (filter.saleItemIds && filter.saleItemIds.length > 0 && filter.divisionIds && filter.divisionIds.length > 0 && filter.revenueCenterIds && filter.revenueCenterIds.length > 0 && filter.modeIds && filter.modeIds.length > 0) {
        let results = [];
        finalResult.forEach(item => {
            let revenueCenters = [];
            item.revenueCenters.forEach(revenue => {
                let newPriceList = [];
                revenue.priceList.forEach(mode => {
                    if (filter.saleItemIds.includes(item.saleItemId) && filter.divisionIds.includes(item.divisionId) && filter.revenueCenterIds.includes(revenue.id) && filter.modeIds.includes(mode.modeId)) {
                        newPriceList.push(mode);
                    }
                })
                if (newPriceList.length > 0) {
                    revenue.priceList = newPriceList;
                    revenueCenters.push(revenue);
                }
            })
            if (revenueCenters.length > 0) {
                item.revenueCenters = revenueCenters;
                results.push(item);
            }
        })
        return results;
    }
    //Filter by SaleItems, Division and RevenueCenter
    if (filter.saleItemIds && filter.saleItemIds.length > 0 && filter.divisionIds && filter.divisionIds.length > 0 && filter.revenueCenterIds && filter.revenueCenterIds.length > 0) {
        let results = [];
        finalResult.forEach(item => {
            let revenueCenters = [];
            item.revenueCenters.forEach(revenue => {
                if (filter.saleItemIds.includes(item.saleItemId) && filter.divisionIds.includes(item.divisionId) && filter.revenueCenterIds.includes(revenue.id)) {
                    revenueCenters.push(revenue);
                }
            })
            if (revenueCenters.length > 0) {
                item.revenueCenters = revenueCenters;
                results.push(item);
            }
        })
        return results;
    }
    //Filter by SaleItems and RevenueCenters
    if (filter.saleItemIds && filter.saleItemIds.length > 0 && filter.revenueCenterIds && filter.revenueCenterIds.length > 0) {
        let filteredSaleResult = finalResult.filter((item) => filter.saleItemIds.includes(item.saleItemId));
        let result = [];
        filteredSaleResult.forEach(item => {
            item.revenueCenters = filterRevenueCenterByIds(item.revenueCenters, filter.revenueCenterIds);
            result.push(item);
        })
        return result;
    }
    //Filter By SaleItems and Division
    if (filter.saleItemIds && filter.saleItemIds.length > 0 && filter.divisionIds && filter.divisionIds.length > 0) {
        let filteredResult = finalResult.filter(item => {
            if (filter.saleItemIds.includes(item.saleItemId) && filter.divisionIds.includes(item.divisionId)) {
                return true;
            }
            return false;
        })
        return filteredResult;
    }
    //Filter By Only SaleItems
    if (filter.saleItemIds && filter.saleItemIds.length > 0) {
        return finalResult.filter((item) => filter.saleItemIds.includes(item.saleItemId));
    }
    //Filter By Only Divisons
    if (filter.divisionIds && filter.divisionIds.length > 0) {
        return finalResult.filter((item) => filter.divisionIds.includes(item.divisionId));
    }
    //Filter By Only Revenue Centers
    if (filter.revenueCenterIds && filter.revenueCenterIds.length > 0) {
        let result = [];
        finalResult.forEach(item => {
            item.revenueCenters = filterRevenueCenterByIds(item.revenueCenters, filter.revenueCenterIds);
            if (item.revenueCenters.length > 0)
                result.push(item)

        })
        return result;
    }
    //Filter by Mode
    if (filter.modeIds && filter.modeIds.length > 0) {
        let results = [];
        finalResult.forEach(item => {
            let revenueCenters = [];
            item.revenueCenters.forEach(revenue => {
                let newPriceList = [];
                revenue.priceList.forEach(mode => {
                    if (filter.modeIds.includes(mode.modeId)) {
                        newPriceList.push(mode);
                    }
                })
                if (newPriceList.length > 0) {
                    revenue.priceList = newPriceList;
                    revenueCenters.push(revenue);
                }
            })
            if (revenueCenters.length > 0) {
                item.revenueCenters = revenueCenters;
                results.push(item);
            }
        })
        return results;
    }
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

const filterRevenueCenterByIds = (revenueCenters, revenueCenterIds) => {
    let filteredCenter = [];
    revenueCenters.forEach(center => {
        if (revenueCenterIds.includes(center.id)) {
            filteredCenter.push(center);
        }
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
    getBusinessDetails: getBusinessDetails

}