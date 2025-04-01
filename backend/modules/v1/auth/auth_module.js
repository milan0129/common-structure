let con = require('../../../config/database');
let headerValidator = require('../../../middleware/headerValidator');
let common = require('../../../common/common');
const path = require("path");

let user_modal = {


    register: function (request, callback) {

        let password;
        headerValidator.encryption(request.password, (response) => {

            password = response;

            let signupObj = {
                email: request.email,
                first_name: request.first_name,
                last_name: request.last_name,
                password: password,
                verification: 'unverified',
            }

            user_modal.checkUniqueEmailUsernameMobile(request, '', (userdetail) => {
                if (userdetail != null && request.email == userdetail.email) {

                    callback(200, '0', 'This email is already in use ', null);
                } else {

                    common.singleInsert('tbl_user', signupObj, (user_id, error) => {
                        common.generateSessionCode(user_id, request, (token) => {
                            if (token == null) {
                                callback(200, '2', 'no data found', null);
                            } else {
                                user_modal.getUserDetails(user_id, (statuscode, responsecode, message, userDetails) => {

                                    if (userDetails == null) {
                                        callback(200, '2', 'no data found', null);
                                    } else {
                                        userDetails.token = token;
                                        common.sendmail(userDetails.email, 'Verification', `<h1>Verification</h1><p>Click <a href="http://localhost:3333/api/v1/auth/email_verify/${token}">here</a> to verify your email.</p>`, (issent) => {
                                            if (issent) {
                                                callback(200, '1', 'Registration is successful ', userDetails);
                                            } else {
                                                callback(200, '1', 'Error in sending mail ', null);
                                            }
                                        });

                                    }
                                });
                            }
                        });
                    });
                }
            });
        });
    },


    login: function (request, callback) {
        let password;
        headerValidator.encryption(request.password, (response) => {
            password = response;
            common.commonSingleSelect(`SELECT u.*,di.role FROM tbl_user u LEFT JOIN tbl_device_info di ON u.id = di.user_id WHERE  u.email = '${request.email}' AND u.password = '${password}' AND u.is_delete = 0`, (userDetails, error) => {
                if (userDetails == undefined) {

                    callback(200, '2', 'password is wrong', null);
                } else if (userDetails != undefined && userDetails.is_active != '1') {
                    callback(200, '3', 'Account was deactivated by admin', null);

                } else if (userDetails != undefined && userDetails.role !== request.role) {
                    callback(200, '4', 'You are not allowed to login from here', null);
                }
                else if (userDetails != undefined && userDetails.verification != 'verified') {
                    callback(200, '0', 'Your email was not verified please verify fisrt', null);

                }
                else {
                    common.checkUpdateDeviceInfo(userDetails.id, userDetails.role, request, (token) => {
                        if (token == null) {
                            callback(200, '2', 'no data found', null);
                        } else {
                            userDetails.token = token;
                            callback(200, '1', 'Login Succesfull', userDetails);
                        }
                    });
                }
            });


        });

    },

    checkUniqueEmailUsernameMobile: function (request, login_user_id, callback) {

        let condition = login_user_id != undefined && login_user_id != "" ? `id != ${login_user_id} AND` : '';
        con.query(`SELECT * FROM tbl_user WHERE ${condition} (email = '${request.email}') AND is_active = '1' AND is_delete = '0'`, (error, result) => {
            if (!error && result.length > 0) {
                callback(result[0]);
            } else {
                callback(null);
            }
        });
    },

    getUserDetails: function (user_id, callback) {
        common.commonSingleSelect(`SELECT u.*, IFNULL(ud.token,'') as token FROM tbl_user u LEFT JOIN tbl_device_info ud ON u.id = ud.user_id WHERE u.id = ${user_id} AND u.is_active = '1' AND u.is_delete = '0'`, (userDetails, error) => {
            if (userDetails == null) {

                callback(200, '2', { keyword: 'rest_keywords_nodata', components: {} }, null);
            } else {
                callback(200, '1', { keyword: 'rest_keywords_success', components: {} }, userDetails);

            }
        });
    },


    email_verify: function (token, res, callback) {
        con.query(`SELECT token,user_id FROM tbl_device_info WHERE token = ?`, [token], (error, response) => {

            if (!error && response.length > 0) {
                let userData = { id: response[0].user_id };
                let updparams = { verification: "verified" };

                user_modal.getUserDetails(response[0].user_id, (statuscode, responsecode, message, userDetails) => {

                    if (userDetails != null) {
                        if (userDetails.verification != "verified") {
                            user_modal.updateuserlist(userData, updparams, function (userprofile, error) {
                                if (userprofile != null) {
                                    res.sendFile(path.join(__dirname, "../../../views/success.html"));
                                } else {
                                    res.sendFile(path.join(__dirname, "../../../views/sorry.html"));
                                }
                            });
                        } else {
                            res.sendFile(path.join(__dirname, "../../../views/already_verified.html"));
                        }
                    } else {
                        res.sendFile(path.join(__dirname, "../../../views/sorry.html"));
                    }
                });
            } else {
                res.sendFile(path.join(__dirname, "../../../views/sorry.html"));
            }
        });
    },

    /**
   * Function to update users details
   * 12-04-2022
   * @param {Login User ID} user_id 
   * @param {Update Parameters} upd_params 
   * @param {Function} callback 
   */

    updateuserlist: function (user_id, upd_params, callback) {
        // console.log("user" + user_id)
        con.query("UPDATE tbl_user SET ? WHERE id = ? ", [upd_params, user_id.id], function (err, result, fields) {
            if (!err) {
                user_modal.getUserDetails(user_id.id, function (response, err) {
                    callback(response);
                });
            } else {
                callback(null, err);
            }
        });
    },


}

module.exports = user_modal;               