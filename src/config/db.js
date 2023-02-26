const env = process.env.NODE_ENV
const db_host = process.env.DB_HOST;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db_name = process.env.DB_NAME;

// Config
let MYSQL_CONF
let REDIS_CONF

if (env === 'dev') {
    const localCredentials = require('./localCredentials')
    MYSQL_CONF = {
        host: localCredentials.DB_HOST,
        user: localCredentials.DB_USER,
        password: localCredentials.DB_PASSWORD,
        port: '3306',
        database: localCredentials.DB_NAME
    }

    // redis
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }
}

if (env === 'production') {
    // mysql
    MYSQL_CONF = {
        host: db_host,
        user: db_user,
        password: db_password,
        port: '3306',
        database: db_name
    }

    // redis
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }
}

module.exports = {
    MYSQL_CONF,
    REDIS_CONF
}