let response = {
    validation_error: {
        status: false,
        message: "Incorrect data"
    }
}
module.exports = response;
module.exports.success = function (key, values) {
    let returnResponse = response[key] == undefined ? {} : response[key];
    returnResponse.status = true;
    values ? returnResponse.values = values : "";
    return returnResponse;
}
module.exports.failed = function (key, errors, lang) {
    console.log("key, errors, lang", key, errors, "sidn", lang)
    let returnResponse = response[key] == undefined ? {} : response[key];
    returnResponse.status = false;
    errors && errors != key ? returnResponse.error = errors : "";
    return returnResponse;
}