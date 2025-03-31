require('dotenv').config();
const jwt = require('jsonwebtoken');
const { SELECT, INSERT, UPDATE } = require('../utils/SQLWorker');
const nodemailer = require("nodemailer");
const twilio = require('twilio');
const JWT_SECRET_KEY='we_are_ecommerce_developer'
const common = {

    jwt_validate: async (token) => {
        try {
            const verified = jwt.verify(token, JWT_SECRET_KEY);

            if (verified) {
                return verified;
            } else {
                throw new Error("token_invalid");
            }
        } catch (error) {
            // Access Denied 
            throw new Error("token_invalid");
        }
    },

    jwt_sign: (user_id, user_type, expiresIn = "365days") => {
        const enc_data = {
            expiresIn,
            data: { user_id, user_type }
        }

        const token = jwt.sign(enc_data, JWT_SECRET_KEY);
        console.log('token', token)
        return token;
    },


    generateToken() {
        var randtoken = require('rand-token').generator();

        var usersession = randtoken.generate(64, "0123456798abcdefghijklmnopqrstuvwxyz")

        return usersession;
    },

    user_information: async (user_id, user_type) => {
        try {
            let user_detail_sql = '';

            user_detail_sql = `SELECT id, first_name, last_name, email ,mobile_no,country_code, is_active, is_deleted FROM tbl_user WHERE id = '${user_id}'`;
            let user_details = await SELECT(user_detail_sql, 'single');
            let device_details = await SELECT(`select id , user_id, token, device_name, device_type, device_token,  os_version from tbl_user_device WHERE user_id = '${user_id}'`, 'single');

            return { user_details, device_details };
        } catch (e) {
            throw new Error("user_not_found");
        }

    },

    sendEmail: (to_mail, subject, message) => {
        return new Promise((resolve, reject) => {

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'gmr840597@gmail.com',
                    pass: 'dyca yebf lahf qads'
                }
            });

            var mailOptions = {
                from: 'gmr840597@gmail.com',
                to: to_mail,
                subject: subject,
                html: message
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (!error) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });

        });
    },

}

module.exports = common;