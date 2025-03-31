const express = require('express');
const app = express();
app.disable("x-powered-by");
let session = require('express-session');
const api_doc = require('./route')

app.use(
    session({
        secret: 'keyboard cat', 
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: (60000 * 60) }
    })
)

app.get('/', api_doc.index);
app.get('/login', api_doc.index);
app.post('/login', api_doc.login);
app.get('/customer/dashboard', api_doc.customer_dashboard);
app.get('/user_list', api_doc.user_list);
app.get('/code', api_doc.code);
app.get('/enc_dec', api_doc.enc_dec);
app.get('/logout', api_doc.logout);

module.exports = app;