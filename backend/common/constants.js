let Globals = {

    'API_KEY': process.env.API_KEY,
    'KEY': process.env.KEY,
    'IV': process.env.IV,
    'EMAIL_ID': process.env.EMAIL_ID,
    'EMAIL_PASSWORD': process.env.EMAIL_PASSWORD,
    //ERROR CODE
    'FAILED': 0,
    'SUCCESS': 1,
    'NO_DATA_FOUND': 2,
    'ACCOUNT_INACTIVE': 3,
    'AUTH_ROLE': 4,
}

module.exports = Globals;