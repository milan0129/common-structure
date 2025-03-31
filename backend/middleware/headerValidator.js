const { SELECT } = require('../utils/SQLWorker');
const common = require('../utils/common.js');
const { ENCRYPTION_BYPASS } = require('../config/constants.js');
const en = require('../languages/en.js');
const CryptoJS = require('crypto-js')
const cryptoLib = require('cryptlib');
const shaKey = cryptoLib.getHashSha256(process.env.KEY, 32);
const { default: localizify } = require('localizify');
const { t } = require('localizify');
const jwt = require('jsonwebtoken');
const CRYPTO_KEY = 'VLaEQrkAjtcyayabGsadsAbFdBMiMZmV'
const CRYPTO_IV = 'VLaEQrkAjtcyayab'
const API_KEY ="common_structure"
const KEY = CryptoJS.enc.Utf8.parse(CRYPTO_KEY);
const IV = CryptoJS.enc.Utf8.parse(CRYPTO_IV);
const SECRET = CryptoJS.enc.Utf8.parse(CRYPTO_KEY);
const JWT_SECRET_KEY='we_are_ecommerce_developer'

const checkApiKey = function (req, res, next) {
    const apiKey = req.headers['api-key'] !== undefined && req.headers['api-key'] !== "" ? req.headers['api-key'] : '';
    if (apiKey !== '') {
        const decApiKey = CryptoJS.AES.decrypt(apiKey, SECRET, { iv: IV }).toString(CryptoJS.enc.Utf8)
        // console.log("api key ", apiKey);
        // console.log("dec api key ", decApiKey);
        // console.log("env key is ", process.env.API_KEY);
        if (decApiKey === API_KEY) {
 
            next();
        } else {
            sendResponse(req, res, 401, '-1', { keyword: 'invalid_api_key', components: {} }, {});
            // return await headerValidator.sendResponse(res, Codes.UNAUTHORIZED, lang[req.language].rest_keywords_api_notvalid_message, null);
        }
    } else {
        sendResponse(req, res, 401, '-1', { keyword: 'invalid_api_key', components: {} }, {});

        // return await headerValidator.sendResponse(res, Codes.UNAUTHORIZED, lang[req.language].rest_keywords_api_notvalid_message, null);
    }
}




const checkToken = async function (req, res, next) {

    try {
        req.loginUser = {};

        const { data } = jwt.verify(req.headers['token'], JWT_SECRET_KEY);
        console.log('data :', data);

        req.loginUser.user_id = data.user_id;
      

        if (data.user_id) {

            const { is_active } = await SELECT(`select u.is_active from tbl_user as u JOIN tbl_user_device as ud ON u.id = ud.user_id where u.id = ${data.user_id} AND u.is_deleted = 0 AND ud.token = '${req.headers['token']}'`, 'single');

            if (is_active == 0) throw new Error('user_inactive_by_admin');
            // if (is_blocked) throw new Error('user_blocked_by_admin');

            next();
        } else {
            throw new Error("token_invalid");
        }
    } catch (e) {
        // Access Denied 

        let keyword = 'token_invalid';

        if (e.message == 'user_inactive_by_admin') {
            keyword = 'user_inactive_by_admin'
        } else if (e.message == 'user_blocked_by_admin') {
            keyword = 'user_blocked_by_admin'
        }

        sendResponse(req, res, 401, '-1', { keyword: keyword, components: {} }, {});
    }
}

// Function to check validation rules for all api's 
const checkBodyInline = (rules, messages = {}, keywords = {}) => {
    return (req, res, next) => {
        let v = require('Validator').make(req.body, rules, messages, keywords);
        if (v.fails()) {
            let Validator_errors = v.getErrors();

            for (let key in Validator_errors) {
                error = Validator_errors[key][0];
                break;
            }

            res.status(200);
            res.json(encryption({ code: '0', message: error }));
        } else {
            next();
        }
    };
};

const checkValidationRules = function (req, res, rules) {
    let v = require('Validator').make(req.body, rules, {}, {});
    if (v.fails()) {
        let Validator_errors = v.getErrors();

        for (let key in Validator_errors) {
            error = Validator_errors[key][0];
            break;
        }

        res.status(200);
        res.json(encryption({ code: 0, message: error }));
        return false;
    } else {
        return true;
    }
}



// Function to return response for any api
const sendResponse = function (req, res, statuscode, responsecode, { keyword, components }, responsedata) {
    // console.log("key word ",keyword);
    
    let formatmsg = getMessage(req.headers['accept-language'], keyword, components);

    let encrypted_data = encryption({ code: responsecode, message: formatmsg, data: responsedata });

    res.status(statuscode);
    res.send(encrypted_data);
}


const decryption = function (req, res, next) {


    try {
        if (req.body != undefined && req.body.length !== 0) {

            const decryptedData = CryptoJS.AES.decrypt(req.body, SECRET, { iv: IV }).toString(CryptoJS.enc.Utf8);
            const request = JSON.parse(decryptedData);
            
            req.body = request; 
            // or req.customData = request; if you want to keep req.body intact
            // Optionally attach other properties if they exist
            if (req.token) {
                req.body.token = req.token; // or request.token = req.token;
            }
            if (req.language) {
                req.body.language = req.language; // or request.language = req.language;
            }

            // Call next() to pass control to the next middleware or route handler
            next();
        } else {
            // If there is no body, just call next()
            next();
        }

    } catch (error) {
        console.log('error :', error);
        res.status(400).json({ code: 0, message: "badEncrypt" });
    }
};


/**
 * 
 * This encryption is done using CRYPTO JS 
 */

const encryption = function (response_data) {
    if (!ENCRYPTION_BYPASS) {
        // return cryptoLib.encrypt(JSON.stringify(response_data), shaKey, process.env.IV);
        return CryptoJS.AES.encrypt(JSON.stringify(response_data), SECRET, { iv: IV }).toString();
    } else {
        return response_data;
    }
}

// Function to send users language from any place
const getMessage = function (requestLanguage, key, value) {
    try {
        localizify
            .add('en', en)
            .setLocale(requestLanguage);

        let message = t(key, value);

        return message;
    } catch (e) {
        return "Something went wrong";
    }
}

module.exports = {
    checkApiKey,
    checkToken,
    sendResponse,
    checkValidationRules,
    decryption,
    encryption,
    checkBodyInline,
  
};
