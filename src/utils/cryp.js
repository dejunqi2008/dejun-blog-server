const crypto = require('crypto')
const jwt = require('jsonwebtoken');


const SECRET_KEY = 'glory_to_Ukraine!'


function md5(content) {
    let md5 = crypto.createHash('md5')
    return md5.update(content).digest('hex')
}


function genPassword(password) {
    const str = `password=${password}&key=${SECRET_KEY}`
    return md5(str)
}

function generateAccessToken(username, realname) {
    return jwt.sign({
        username, realname
    }, process.env.JWT_TOKEN_SECRET, { expiresIn: '1d' });
}

module.exports = {
    genPassword,
    generateAccessToken
}