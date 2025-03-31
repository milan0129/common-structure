const con = require("../config/database");

const no_data_msg = 'no_data';
const failed_msg = "failed";

module.exports = {
    //////////////////////////////////////////////////////////////////////
    //                           DB  Workers                            //
    //////////////////////////////////////////////////////////////////////

    SELECT: (query, type, no_data_err = true) => {
        return new Promise((resolve, reject) => {
            con.query(query, (err, result) => {
                // console.log("query ", query);
                if (!err) {                
                    if (result.length > 0) {
                        // console.log("final result ", result);
                        
                        if (type == 'single') {
                            resolve(result[0]);
                        } else {
                            resolve(result);
                        }
                    } else {
                        if (no_data_err) {
                            reject(new Error(no_data_msg));
                        } else {
                            resolve([]);
                        }
                    }
                } else {
                    console.log("select error is  --------------------------------------->>>>>>>>>>>>>>", err);

                    reject(new Error(failed_msg));
                }
            })
        });
    },

    UPDATE: (query, data) => {
        return new Promise((resolve, reject) => {
            con.query(query, data, (err, result) => {

                console.log("query is ", data);

                if (!err) {
                    resolve(result);
                } else {
                    console.log("update error is ", err);

                    reject(new Error(failed_msg));
                }
            })
        });
    },

    INSERT: (query, data) => {
        // console.log("query are ", query ,"data are ", data);
        return new Promise((resolve, reject) => {
            con.query(query, data, (err, result) => {
                // console.log("query is.......", query,"data is..........", data);

                
                if (!err) {
                    resolve(result.insertId);
                } else {
                    
                    console.log("errerererer", err);
                    
                    reject(new Error(failed_msg));
                }

                console.log("error is ....................", err);

            })
        });
    },

    DELETE: (query) => {
        return new Promise((resolve, reject) => {
            con.query(query, (err, result) => {
                if (!err) {
                    resolve();
                } else {
                    reject(new Error(failed_msg));
                }
            });
        });
    },
};