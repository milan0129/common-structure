let con = require("./../config/database");
var nodemailer = require('nodemailer');
let GLOBALS = require('../common/constants');

let Validate = {
  generateSessionCode: function (user_id, request, callback) {

    console.log("generate session code ", request);
    let randtoken = require("rand-token").generator();
    let usersession = randtoken.generate(64, "0123456789abcdefghijklnmopqrstuvwxyz");

    Validate.checkDeviceInfo(user_id, request.role, function (DeviceInfo, Error) {
      if (DeviceInfo != null) {
        let params = {
          token: usersession,
        };
        Validate.updateDeviceInfo(user_id, request.role, params, function () {
          callback(usersession);
        });
      } else {
        let params = {
          role: request.role,
          user_id: user_id,
          token: usersession,
        };
        Validate.addDeviceInformation(params, function (data) {
          console.log(usersession);
          callback(usersession);
        });
      }
    }
    );
  },

  checkDeviceInfo: function (user_id, user_type, callback) {
    con.query("SELECT * FROM tbl_device_info WHERE user_id = '" + user_id + "' AND role='" + user_type + "' ", function (err, result) {
      if (!err && result[0] != undefined) {
        callback(result[0]);
      } else {
        callback(null, err);
      }
    }
    );
  },

  updateDeviceInfo: function (user_id, user_type, params, callback) {
    con.query("UPDATE tbl_device_info SET ? WHERE user_id = '" + user_id + "' AND role='" + user_type + "' ", params, function (err, result, fields) {
      callback(result);
    });
  },

  addDeviceInformation: function (params, callback) {
    con.query("INSERT INTO tbl_device_info SET ?", params, function (err, result, fields) {
      callback(result);
    });
  },

  checkUpdateDeviceInfo: function (user_id, user_type, request, callback) {

    let randtoken = require("rand-token").generator();
    let usersession = randtoken.generate(64, "0123456789abcdefghijklnmopqrstuvwxyz");

    let upd_device = {
      token: usersession,
    };

    Validate.checkDeviceInfo(user_id, user_type, function (DeviceInfo, Error) {
      if (DeviceInfo != null) {
        Validate.updateDeviceInfo(user_id, user_type, upd_device, function (result, error) {
          callback(usersession);
        });
      } else {
        upd_device.user_id = user_id;
        Validate.addDeviceInformation(upd_device, function (result) {
          callback(usersession);
        });
      }
    });
  },

/**
   * Function to send email to users
   * @param {subject} subject
   * @param {to email} to_email
   * @param {message} message
   * @param {Function} callback
   */
sendmail: function (to_email, subject, message, callback) {
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GLOBALS.EMAIL_ID, 
        pass: GLOBALS.EMAIL_PASSWORD
      }
    });

    var mailOptions = {
      to: to_email,
      subject: subject,
      html: message
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error)
        callback(false)
      } else {
        console.log('Email sent: ' + info.response)
        callback(true)
      }
    })
  },
  
  /*
   ** Common Single Insert operation
   */

  singleInsert: function (tablename, params, callback) {
    con.query(
      "INSERT INTO " + tablename + " SET ?",
      params,
      function (error, result, fields) {
        if (!error) {
          callback(result.insertId, error);
        } else {
          console.log(error);
          callback(null, error);
        }
      }
    );
  },

  /*
   ** Common Single update operation
   */
  singleUpdate: function (tablename, params, condition, callback) {
    let de= con.query("UPDATE " + tablename + " SET ? WHERE " + condition + " ",params,
      function (error, result, fields) {
        if (!error) {
          console.log(de);
          callback(result, error);
        } else {
          console.log(error);
          callback(null, error);
        }
      }
    );
  },

 

  /*
   ** Common Delete function
   */

    getCommonSingleRecord: function (tablename, condition, callback) {
    con.query("SELECT * from " + tablename + " WHERE " + condition + " ",
      function (error, result, fields) {
        if (!error) {
          callback(result[0], error);
        } else {
          console.log(error);
          callback([], error);
        }
      }
    );
  },

  
  //common single select tabel details
  commonSingleSelect: function (query, callback) {
    //select query
    con.query(query, function (err, result, fields) {
      if (!err && result.length > 0) {
        console.log("result", result[0]);
        callback(result[0]);
      } else {
        if (err) {
          console.log("Common single Select Error :- ", err);
        }
        callback(null);
      }
    }); //end select query
  },


};
module.exports = Validate;