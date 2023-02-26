const mysql = require('mysql')
const { MYSQL_CONF } = require('../config/db')

const con = mysql.createConnection(MYSQL_CONF)
const pool = mysql.createPool({
    ...MYSQL_CONF,
    connectionLimit: 10
})

// con.connect()

function exec(sql) {
    const promise = new Promise((resolve, reject) => {
        pool.query(sql, (err, result) => {
            if (err) {
                reject(err)
                return
            }
            resolve(result)
        })
    })
    return promise
}

module.exports = {
    exec,
    escape: mysql.escape
}