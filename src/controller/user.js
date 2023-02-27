const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')

const login = (username, password) => {
    username = escape(username)

    password = genPassword(password)
    console.log(password)
    password = escape(password)
    console.log(password)

    password = '12345';

    const sql = `
        select username, realname from users where username=${username} and password=${password}
    `
    // console.log('sql is', sql)
    return exec(sql).then(rows => {
        console.log(rows);
        return rows[0] || {}
    })
}

module.exports = {
    login
}