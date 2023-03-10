const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')


const validateUsername = async (username) => {
    const sql = `SELECT username FROM users`;
    const resp = await exec(sql);
    // resp.forEach(item => console.log(item.username));
    const res = resp.find(item => item.username === username)
    if (res) {
        return false;
    }
    return true;

}


const signup = async ({username, password, realname}) => {
    const valid = await validateUsername(username);
    console.log(valid);
    if (!valid) {
        return {success: false, message: 'Username was already taken'};
    }

    if (!realname) {
        realname = username;
    }
    username = escape(username)
    password = genPassword(password)
    password = escape(password)

    const sql = `
        INSERT INTO users (username, password, realname)
            VALUES (${username}, ${password}, '${realname}')
    `

    console.log('sql is ', sql);
    const resp = await exec(sql);
    const success =  resp.affectedRows > 0;
    const message = success ? '' : 'Unknown error'
    return {success, message};
} 

const login = async (username, password) => {

    username = escape(username)
    password = genPassword(password)
    password = escape(password)

    const sql = `
        SELECT username, realname FROM users WHERE username=${username} and password=${password}
    `
    const rows = await exec(sql)
    return rows[0] || {}
}


const getUser = async (username) => {
    username = escape(username);
    const columns = 'username, realname, id, introduction, isadmin, emailaddr, linkedinaddr, githubaddr'
    const sql = `
        SELECT ${columns} FROM users WHERE username=${username}
    `
    const rows = await exec(sql)
    return rows[0] || {}
}

const updateUser = async (requestBody) => {
    const {
        username,
        realname,
        emailaddr,
        githubaddr,
        linkedinaddr,
        introduction
    } = requestBody;
    const sql = `
        UPDATE users SET realname='${realname}',
            emailaddr='${emailaddr}',
            githubaddr='${githubaddr}',
            linkedinaddr='${linkedinaddr}',
            introduction='${introduction}'
        WHERE username=${escape(username)}
    `

    console.log('updateUser is: ', sql);
    const updateData = await exec(sql);
    return updateData.affectedRows > 0;
}

const cookieMaxAge = 24 * 60 * 60 * 1000;

module.exports = {
    login,
    getUser,
    updateUser,
    signup,
    cookieMaxAge: cookieMaxAge
}