const { SELECT, INSERT, UPDATE, DELETE } = require('../../../utils/SQLWorker');
const con = require('../../../config/database');
// const uniqueCheck = require('../../../../utils/uniqueMiddleware');
// const { sendResponse } = require('../../../../middleware/headerValidator');
const common = require('../../../utils/common');
const CODES = require('../../../config/codes');
let md5 = require('md5');
const CryptoJS = require('crypto-js')
const CRYPTO_KEY = 'VLaEQrkAjtcyayabGsadsAbFdBMiMZmV'
const CRYPTO_IV = 'VLaEQrkAjtcyayab'

const KEY = CryptoJS.enc.Utf8.parse(CRYPTO_KEY);
const IV = CryptoJS.enc.Utf8.parse(CRYPTO_IV);
const SECRET = CryptoJS.enc.Utf8.parse(process.env.KEY);


// const forgot_pass_template = require('../../../../views/templates/forgot_pass');
// const forget_pass_customer_templte = require('../../../../views/templates/forgot_pass_customer');
// const user_email_verification_templete = require('../../../../views/templates/user_verification_email');
// const supplier_invitation_templete = require('../../../../views/templates/supplier_invitation');
const send_newsletter_templete = require('../../../views/templates/newsletter_send')
const codes = require('../../../config/codes');


let cronModel = {


    async send_newsletter() {
        try {
          
            const result = await SELECT(`
            SELECT sl.id ,sl.content , ns.email,ad.subject
            from 
            tbl_send_newsletter sl
            join tbl_admin_newsletters ad on ad.id = sl.newsletter_id
            join tbl_newsletter_subscribers ns on ns.id = sl.subscriber_id
            where sl.is_send = 0 and ns.is_active = 1`,'MULTI')

            if (result.length>0 ) {
                
                const content = result[0].content;
                const subject = result[0].subject ;
                console.log("content is.....", content);
                
                let newsletterTemplete = send_newsletter_templete(content);


                const emailSend = result.map(async (row) => {
                    const { content, email, id } = row;
        
                    // Create the email options
                    // const mailOptions = {
                    //     from: '"Your Name" <your_email@example.com>', // sender address
                    //     to: email, // recipient address
                    //     subject: 'Your Newsletter Subject', // Subject line
                    //     html: htmlTemplate({ content }), // Pass the content to the template
                    // };
        
                    // Send the email
                    // await transporter.sendMail(mailOptions);
                    await common.sendEmail(email, `${subject}`, newsletterTemplete);

                    let updateObj ={
                        is_send :1
                    }
                    let updateQ = `UPDATE tbl_send_newsletter SET ? where id = ${id}`
                    await UPDATE(updateQ, updateObj)

                    console.log(`Newsletter sent to: ${email}`, "and content is ",content);
                });

                await Promise.all(emailSend);

            } else {

                console.log("no newsletter to send");
            }

            
        } catch (error) {

            // console.log("errr", error);

            if (error= "no_data ") {
                    console.log("No newsletter to send");
            }

            // return middleware.sendResponse(res, Codes.ERROR, lang[req.language].rest_keywords_err_message, [])

        }


    },




}

module.exports = cronModel;