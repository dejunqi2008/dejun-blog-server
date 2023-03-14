const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session')
const cors = require('cors');

const indexRouter = require('./src/routes/index');
const blogRouter = require('./src/routes/blog');
const userRouter = require('./src/routes/user');
const imageRouter = require('./src/routes/image')
const { whitelistDomains, whitelistMethods } = require('./src/utils/corsUtil');
const { cookieMaxAge } = require('./src/controller/user');
require('dotenv').config()


const app = express();

app.use(cors({
    origin: whitelistDomains,
    methods: whitelistMethods,
    credentials: true
}));
app.use(logger('dev'));
app.use(express.json()); // requestion information are converted to json into body
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(session({
    secret: 'WJiol#23123',
    cookie: {
        path: '/', // default
        httpOnly: true, // default
        maxAge: cookieMaxAge,
        sameSite: true
    },
    resave: false,
    saveUninitialized: true,
}))

app.use('/', indexRouter);
app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);
app.use('/api/images', imageRouter);


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
