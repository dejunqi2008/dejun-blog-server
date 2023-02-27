const redis = require('redis');
const { REDIS_CONF } = require('../config/db');

const connectUrl = `redis://${REDIS_CONF.host}:${REDIS_CONF.port}`;
console.log(connectUrl);
const redisClient = redis.createClient({
    url: connectUrl,
    legacyMode: true
});

redisClient.connect()
.then(() => {console.log('redis connect success')})
.catch(err => console.error(err));

module.exports = redisClient