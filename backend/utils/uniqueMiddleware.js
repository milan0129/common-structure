const con = require('../config/database');
const twilio = require('twilio');
const uniqueCheck = {

    checkEmail: (email) => {
    console.log('email :', email);
        return new Promise((resolve, reject) => {
            con.query(`select id from tbl_user where email = '${email}' AND  is_active = 1 AND is_deleted = 0;`, (err, result) => {
            console.log('result :', result);
            console.log('err :', err);
               
                
                if (!err) {
                    if (result.length > 0) {
                        reject(new Error("duplicate_email"));
                    } else {
                        // con.query(`delete u, s from tbl_user u LEFT JOIN tbl_user_device s ON u.id = s.user_id where u.email = '${email}' `, (err, result) => {
                            resolve();
                        // });
                    }
                } else {
                    reject(new Error("failed"));
                }
            });
        });
    },


    checkMobile: (mobile, country_code) => {
        return new Promise((resolve, reject) => {
            con.query(`select id from tbl_user where mobile_no = '${mobile}' AND country_code = '${country_code}' AND is_active = 1 AND is_deleted = 0;`, (err, result) => {
                console.log('result :', result);
                console.log('err :', err);
                if (!err) {
                    if (result.length > 0) {
                        reject(new Error("duplicate_phone"));
                    } else {
                        // con.query(`delete u, s from tbl_users u LEFT JOIN tbl_user_device s ON u.id = s.user_id where u.mobile_no = '${mobile}' AND u.country_code = '${country_code}' `, (err, result) => {
                            resolve();
                        // });
                    }
                } else {
                    // console.log("errr", err);
                    reject(new Error("failed"));
                }
            });
        });
    },


    sendMessageTwlio: async(message_data,receiver_no)=>{
        try {


            const devlopmentstage = process.env.TWLIO_DEVELOPMENT_STAGE

            const accountSid = (devlopmentstage == 'TEST' ? process.env.TEST_TWLIO_SID : process.env.TWLIO_SID);
            const authToken =(devlopmentstage == 'TEST' ? process.env.TEST_TWLIO_AUTH_TOKEN : process.env.TWLIO_AUTH_TOKEN);
            const fromNumber = (devlopmentstage == 'TEST' ? process.env.TWLIO_SENDBOX_NUMBER : process.env.TWLIO_SENDBOX_NUMBER);
            console.log("all logs ,",devlopmentstage,"asd",accountSid,"as",authToken,"asd",fromNumber);
            
            const client = twilio(accountSid, authToken);
            const message = await client.messages.create({
              body: message_data,
              from: `whatsapp:${fromNumber}`, 
              to: `whatsapp:${receiver_no}`,
            });

            console.log("message is ", message);
            
            return message.sid; 
          } catch (error) {

            console.log("Twlio error is.......", error);


            throw new Error('Failed to send message: ' + error.message);
          }

    }


}

module.exports = uniqueCheck;