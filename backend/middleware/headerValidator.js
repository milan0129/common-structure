let con = require('../config/database');
let cryptoLib = require('cryptlib');
let GLOBALS = require('../common/constants');
let shaKey = cryptoLib.getHashSha256(GLOBALS.KEY, 32);


let headerValidator = {

 
    validateHeaderApiKey: function (req, res, callback) {
        let apiBypassMethod = ["email_verify"];
        let path_data = req.path.split("/");
        if (apiBypassMethod.indexOf(path_data[4]) == -1) {
            
            let api_key = (req.headers['api-key'] != undefined && req.headers['api-key'] != '') ? cryptoLib.decrypt(req.headers['api-key'], shaKey, GLOBALS.IV) : "";
    
            if (api_key == GLOBALS.API_KEY) {
                callback();
            } else {
                headerValidator.sendresponse(req, res, 401, '-1', { keyword: 'rest_keywords_invalid_api_key', components: {} }, null);
            }
        } else {
            callback();
        }
    },

    /**
     * Function to return response for any api
     * @param {Request Object} req 
     * @param {Response Object} res 
     * @param {Status code} statuscode 
     * @param {Response code} responsecode 
     * @param {Response Msg} responsemessage 
     * @param {Response Data} responsedata 
     */

    sendresponse: function (req, res, statuscode, responsecode, responsemessage, responsedata) {

        // headerValidator.getMessage(req.lang, responsemessage.keyword, responsemessage.components, function (formedmsg) {
            if (responsedata != null) {
                let response_data = { code: responsecode, message: responsemessage, data: responsedata };
                // headerValidator.encryption(response_data, function (response) {
                    res.status(statuscode);
                    res.json(response_data);
                    // res.json(response_data);
                // });
            } else {
                let response_data = { code: responsecode, message: responsemessage, data: responsedata };
                
                // headerValidator.encryption(response_data, function (response) {
                    res.status(statuscode);
                    // res.json(response);
                    res.json(response_data);
                // });
            }
        // });
    },


    /**
     * Function to encrypt the response body before sending response
     * 03-12-2019
     * @param {Response Body} req 
     * @param {Function} callback 
     */

    encryption: function (req, callback) {
        let cryptoLib = require('cryptlib');
        let shaKey = cryptoLib.getHashSha256(GLOBALS.KEY, 32);
        let response = cryptoLib.encrypt(JSON.stringify(req), shaKey, GLOBALS.IV);
        callback(response);
    },


}
module.exports = headerValidator;