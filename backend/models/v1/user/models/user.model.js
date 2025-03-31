const { SELECT, INSERT, UPDATE, DELETE } = require('../../../../utils/SQLWorker');
const con = require('../../../../config/database');
const uniqueCheck = require('../../../../utils/uniqueMiddleware');
const { sendResponse } = require('../../../../middleware/headerValidator');
const common = require('../../../../utils/common');
const CODES = require('../../../../config/codes');
let md5 = require('md5');
const CryptoJS = require('crypto-js')
const CRYPTO_KEY = 'VLaEQrkAjtcyayabGsadsAbFdBMiMZmV'
const CRYPTO_IV = 'VLaEQrkAjtcyayab'

const KEY = CryptoJS.enc.Utf8.parse(CRYPTO_KEY);
const IV = CryptoJS.enc.Utf8.parse(CRYPTO_IV);
const SECRET = CryptoJS.enc.Utf8.parse(process.env.KEY);


const forgot_pass_template = require('../../../../views/templates/forgot_pass');
const forget_pass_customer_templte = require('../../../../views/templates/forgot_pass_customer');
const user_email_verification_templete = require('../../../../views/templates/supplier_verification_email');
const supplier_invitation_templete = require('../../../../views/templates/supplier_invitation');
const codes = require('../../../../config/codes');

let userModel = {




    user_sign_up: async (req, res) => {

        let body = req.body;
        console.log('body :', body);
        try {
            let enc_password = CryptoJS.AES.encrypt(JSON.stringify(body.password), SECRET, { iv: IV }).toString()

            await uniqueCheck.checkEmail(body.email);
            await uniqueCheck.checkMobile(body.phone, body.country_code);

            user_insert = {
                first_name: body.first_name,
                last_name: body.last_name,
                country_code: body.country_code,
                mobile_no: body.mobile_no,
                email: body.email,
                password: enc_password,
                profile_picture: '1731932037013.png',

            }
            let user_id = await INSERT(`INSERT INTO tbl_user SET ?`, user_insert);

            console.log("user details are ", user_id);

            let user_device_insert = {
                user_id: user_id,
                device_token: "",
                device_type: "W",
                os_version: " ",
                device_name: " ",
                app_version: " "
            }

            user_device_insert.token = await common.jwt_sign(user_id, 'customer');

            await INSERT(`INSERT INTO tbl_user_device SET ?`, user_device_insert);

            let user_details = await common.user_information(user_id, 'customer');
            return sendResponse(req, res, 200, CODES.INCOMPLTE_PROFILE, { keyword: "Account created successfully", components: {} }, user_details);


        }
        catch (e) {
            console.log("error is ", e);

            let keyword = "failed";
            let components = {};


            if (e.message === "duplicate_email") {
                keyword = "duplicate_email";
            } else if (e.message === "duplicate_phone") {
                keyword = "duplicate_phone";
            } else if (e.message === "duplicate_social_id") {
                keyword = "duplicate_social_id";
            } else {
                keyword = "Something went wrong ";
            }

            return sendResponse(req, res, 200, 0, { keyword: keyword, components: components }, null);
        }
    },



    user_sign_in: async (req, res) => {

        let body = req.body;
        try {
            // console.log("body is ", body);

            let enc_password = CryptoJS.AES.encrypt(JSON.stringify(body.password), SECRET, { iv: IV }).toString()

            let user_data = await SELECT(`Select * from tbl_user where email = '${body.email}' and password = '${enc_password}'`, 'single');
            // console.log("user data ", user_data.email);

            if (user_data.is_active == 0) {
                throw new Error("contact_admin");
            } else {

                let user_device_insert = {
                    user_id: user_data.id,
                    device_token: "",
                    device_type: "W",
                    os_version: " ",
                    device_name: " ",
                    app_version: " "
                }

                user_device_insert.token = await common.jwt_sign(user_data.id, 'customer');

                await UPDATE(`UPDATE tbl_user_device SET ? WHERE user_id = ${user_data.id}`, user_device_insert);

                let user_details = await common.user_information(user_data.id, 'customer');


                responseCode = "1";
                return sendResponse(req, res, 200, responseCode, { keyword: "Login successfully", components: {} }, user_details);




            }

        }
        catch (e) {
            console.log("error is ", e);

            let keyword = "failed";
            let components = {};


            if (e.message === "duplicate_email") {
                keyword = "duplicate_email";
            } else if (e.message === "duplicate_phone") {
                keyword = "duplicate_phone";
            } else if (e.message === "contact_admin") {
                keyword = "Contact administration team ";
            } else {
                keyword = "Please provide valid creadencials";
            }

            return sendResponse(req, res, 200, 0, { keyword: keyword, components: components }, null);
        }
    },


    add_product:async(req,res) => {
        let body = req.body;
        console.log('body :', body);
        try {

            product_insert = {
                category_id: body.category_id,
                vendor_id: body.vendor_id,
                country_id: body.country_id,
                name: body.name,
                price: body.price,
                description:body.description
            }
            let addProduct = await INSERT(`INSERT INTO product_tbl SET ?`, product_insert);

            return sendResponse(req, res, 200, CODES.success, { keyword: "Product created successfully", components: {} },null);


        }
        catch (e) {
            console.log("error is ", e);

            let keyword = "Something went wrong ";
            let components = {}; 

            return sendResponse(req, res, 200, 0, { keyword: keyword, components: components }, null);
        }
    },


}

module.exports = userModel;