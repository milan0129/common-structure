var express = require('express');
var router = express.Router();
var middleWare = require('../../../middleware/headerValidator');
var auth_modal = require('../auth/auth_module');




router.post('/register', (req, res) => {
    let request = req.body;
    console.log(request, 'request body');
    
    auth_modal.register(request, (statuscode, responsecode, message, data) => {
        middleWare.sendresponse(req, res, statuscode, responsecode, message, data);
    });

});


router.post('/login', (req, res) => {
     let request = req.body;
    auth_modal.login(request, (statuscode, responsecode, message, data) => {
        middleWare.sendresponse(req, res, statuscode, responsecode, message, data);
    });


});

router.get('/email_verify/:token', function (req, res) {

    let token = req.params.token;
    auth_modal.email_verify(token, res, function (responsecode, responsemsg, responsedata) {

    });

});

module.exports = router;