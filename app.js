const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session')
const cors = require('cors');

const RedisStore  = require('connect-redis')(session);

const indexRouter = require('./src/routes/index');
const blogRouter = require('./src/routes/blog');
const userRouter = require('./src/routes/user');
const { whitelistDomains, whitelistMethods } = require('./src/utils/corsUtil');
const redisClient = require('./src/db/redis');

const app = express();


/* To resolve lost session issue, in the fron end we have to fetch ajax with this way in the post request
function post(url, data = {}) {
    return $.ajax({
        type: 'post',
        ...
        xhrFields: {
            withCredentials: true, // This is the key
        }
    })
}

*/
app.use(cors({
    origin: whitelistDomains,
    methods: whitelistMethods,
    credentials: true
}));
app.use(logger('dev'));
app.use(express.json()); // requestion information are converted to json into body
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const sessionStore = new RedisStore({ client: redisClient })

app.use(session({
    secret: 'WJiol#23123',
    cookie: {
        path: '/', // default
        httpOnly: true, // default
        maxAge: 24 * 60 * 60 * 1000
    },
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
}))

app.use('/', indexRouter);
app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'dev' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.status(500).json({
        error: err,
        message: err.message
    });
});

module.exports = app;
