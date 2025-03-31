let express = require('express');
let path = require('path');
let constants = require('../config/constants');
let api_model = require('../api_document/api_model');
const { log } = require('console');

let app = express()
app.set('view engine', 'ejs');
app.disable("x-powered-by");
exports.index = function (req, res) {
    let message = '';
    res.render(path.join(__dirname + '/views/index.ejs'), { message: message, constants: constants });
};

exports.login = function (req, res) {
    if (req.method == "POST") {
        if (req.body.password == constants.API_PASSWORD) {
            req.session.user = constants.API_PASSWORD;
            res.redirect('/v1/api_document/customer/dashboard');
        } else {
            res.render(path.join(__dirname + '/views/index.ejs'), { message: 'Please enter valid password.', constants: constants });
        }
    } else {
        res.render(path.join(__dirname + '/views/index.ejs'), { message: '', constants: constants });
    }
};

exports.customer_dashboard = function (req, res, next) {
    if (req.session.user == null) {
        res.redirect("/v1/api_document/login");
    } else {
        res.render(path.join(__dirname + '/views/customer_api_doc.ejs'), { constants: constants });
    }
};

exports.user_list = function (req, res) {
    if (req.session.user == null) {
        res.redirect("/v1/api_document/login");
        return;
    }
    api_model.apiuserList((response) => {
        res.render(path.join(__dirname + '/views/user_list.ejs'), { data: response, constants: constants })
    });
};

exports.code = function (req, res) {
    if (req.session.user == null) {
        res.redirect("/v1/api_document/login");
        return;
    }
    res.render(path.join(__dirname + '/views/reference_code.ejs'), { constants: constants });
};

exports.enc_dec = function (req, res) {
    if (req.session.user == null) {
        res.redirect("/v1/api_document/login");
        return;
    }
    console.log("dire", __dirname);
    
    res.render(path.join(__dirname + '/views/enc_dec.php'), {})
};

exports.logout = function (req, res) {
    req.session.destroy(function (err) {
        res.redirect("/v1/api_document/login");
    });
};