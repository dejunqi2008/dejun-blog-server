const mysql = require('mysql')
const { MYSQL_CONF } = require('../config/db')

const con = mysql.createConnection(MYSQL_CONF)
const pool = mysql.createPool({
    ...MYSQL_CONF,
    connectionLimit: 10
})

const query = (sql) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, (err, result) => {
            if (err) {
                return reject(err);
            }
            return resolve(result);
        })
    });
}

const exec = async (sql) => {
    let res = null
    try {
        res = await query(sql);
    } catch (err) {
        res = { error: err };
    }
    return res;
}


module.exports = {
    exec,
    escape: mysql.escape
}