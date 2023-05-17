const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')
const { mysql_real_escape_string } = require('../utils/commonUtils');

const validateUsername = async (username) => {
    const sql = `SELECT username FROM users`;
    const resp = await exec(sql);

    const res = resp.find(item => item.username === username)
    if (res) {
        return false;
    }
    return true;
}

const validateInputStr = async (str) => {
    const invalid = ['*', 'select', 'delete', 'update', 'get', 'drop'];
    str = str.toLowerCase();
    return !invalid.find(s => str.includes(s));
}


const signup = async ({username, password, realname}) => {
    const valid = await validateUsername(username);
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

    const resp = await exec(sql);
    const success =  resp.affectedRows > 0;
    const message = success ? '' : 'Unknown error'
    return {success, message};
}

const login = async (username, password) => {
    if (!validateInputStr(username) || !validateInputStr(password)) {
        return {};
    }
    username = escape(username)
    password = genPassword(password)
    password = escape(password)

    const sql = `
        SELECT id, username, realname FROM users WHERE username=${username} and password=${password}
    `
    const rows = await exec(sql)
    return rows[0] || {}
}


const getUser = async (username) => {
    username = escape(username);
    const columns = 'username, realname, id, introduction, isadmin, emailaddr, linkedinaddr, githubaddr, profilephoto'
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
        introduction,
        profilephoto
    } = requestBody;

    const photosql = !!profilephoto ? `, profilephoto='${profilephoto}'` : ''

    const sql = `
        UPDATE users SET realname='${realname}',
            emailaddr='${emailaddr}',
            githubaddr='${githubaddr}',
            linkedinaddr='${linkedinaddr}',
            introduction='${mysql_real_escape_string(introduction)}' ` + photosql + ` WHERE username=${escape(username)}`

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