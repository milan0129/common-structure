const express = require('express')
const { decryption, checkValidationRules, checkBodyInline, checkToken, checkApiKey } = require('../../../../middleware/headerValidator');
const userModel = require('../models/user.model');
const router = express.Router()
// const userController =  require('../controller/user_controllers');

// router.post('/signup', userController.signup);



router.post('/sign_up', checkApiKey, decryption, (req,res)=>{


    let rules ={
        first_name:'required',
        last_name:'required',
        country_code:'required',
        mobile_no:'required',
        email:'required',
        password:'required'
    }

    if (checkValidationRules(req, res, rules)) userModel.user_sign_up(req, res);
});




router.post('/sign_in', checkApiKey, decryption, (req, res) => {

    let rules = {
        email: 'required',
        password: 'required'
    }

    if (checkValidationRules(req, res, rules)) userModel.user_sign_in(req, res);
});

//add product

router.post('/add_product', checkApiKey, checkToken, decryption, (req, res) => {

    let rules = {
        category_id:'required',
        vendor_id:'required',
        country_id:'required',
        name:'required',
        price:'required',
        description:'required'
    }

    if (checkValidationRules(req, res, rules)) userModel.add_product(req, res);
});



/** 
 * Forget password  for user 
*/
router.post('/forget_password', checkApiKey, decryption, (req, res) => {

    let rules = {
        email: 'required',
    }

    if (checkValidationRules(req, res, rules)) userModel.forgot_password(req, res);
});


router.post('/change_forget_pass', checkApiKey, decryption, (req, res) => {

    let rules = {
        token: 'required',
        password:'required'
    }
    if (checkValidationRules(req, res, rules)) userModel.chnage_password_forgetpassword(req, res);

});


/**
 * this api use for contact us for customer 
 */

router.post('/contact_us', checkApiKey,decryption, (req, res) => {

    let rules = {
        first_name:'required',
        last_name:'required',
        email:'required',
        country_code:'required',
        mobile_no:'required',
        bussiness_title:'required',
        company_name:'required',
        company_size:'required',
        here_about_us:'required',
        message:'required'
    }
    
    if (checkValidationRules(req, res, rules)) userModel.contact_us(req, res);


});


module.exports = router;