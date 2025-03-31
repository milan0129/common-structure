let con = require('../config/database');
let constants = require('../config/constants');
let cryptoLib = require('cryptlib');
let shaKey = cryptoLib.getHashSha256(process.env.KEY, 32);

const API = {

    /**
     * Function to get api users list
     * 04-06-2021
     * @param {Function} callback
     */
    apiuserList: function (callback) {
        con.query(`SELECT u.id, u.user_type, u.sign_step, tud.token, tud.device_type, u.first_name, u.last_name, u.brand_name, u.email, u.phone, u.is_verify, u.otp, tud.device_token FROM tbl_users u JOIN tbl_user_device tud on u.id = tud.user_id WHERE u.is_delete = 0 ORDER BY u.id DESC`, function (err, result, fields) {
            if (!err) {
                callback(result);
            } else {
                callback(null);
            }
        });
    },
}

module.exports = API;