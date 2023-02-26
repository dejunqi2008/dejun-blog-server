const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const session = require('express-session')


const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');

const app = express();

app.use(logger('dev'));
app.use(express.json()); // requestion information are converted to json into body
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'jwo$%#$Apq',
    cookie: {
        path: '/', // default
        httpOnly: true, // default
        maxAge: 24 * 60 * 60 * 1000
    }
}))


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
    res.render('error');
});

module.exports = app;