const bodyParser = require('body-parser');
const compression = require('compression');
const cons = require('consolidate');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const flash = require('express-flash');
const helmet = require('helmet');
const logger = require('morgan');
const mongoose = require('mongoose');
const path = require('path');
const sanitize = require('sanitize');
const session = require('express-session');
const stylus = require('stylus');

const MongoStore = require('connect-mongo')(session);
const index = require('./src/routes/index');

const authenticate = require('./src/lib/authenticate');

const app = express();

if (!xConfig.debugMode)
    app.locals.cache = true;

app.set('views', path.join(__dirname, 'views'));
app.engine('html', cons.ejs);
app.set('view engine', 'html');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
const corsOption = {
    origin : true,
    methods : 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials : true,
    exposedHeaders : [ 'x-auth-token' ]
};
app.use(cors(corsOption));
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));
app.use(cookieParser());
app.use(stylus.middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));

app.use(session({
    secret : xConfig.crypto.SessionKey,
    resave : false,
    saveUninitialized : false,
    cookie : { maxAge : xConfig.auth.expiry, httpOnly : false, secure : !xConfig.debugMode },
    store : new MongoStore({
        mongooseConnection : mongoose.connection,
        ttl : 15 * 24 * 60 * 60,
        touchAfter : 24 * 3600
    })
}));

app.use(flash());
app.use(sanitize.middleware);

require('./src/routes/express')(app);

app.use('/', index);

app.get('/secure', authenticate(), function (req, res) {
    res.json({ message : 'Secure data' })
});

app.get('/me', authenticate(), function (req, res) {
    res.json({
        me : req.user,
        messsage : 'Authorization success, Without Scopes, Try accessing /profile with `profile` scope',
        description : 'Try postman https://www.getpostman.com/collections/37afd82600127fbeef28',
        more : 'pass `profile` scope while Authorize'
    })
});

app.get('/profile', authenticate({ scope : 'profile' }), function (req, res) {
    res.json({
        profile : req.user
    })
});

app.all('/cb', (req, res) => {
    console.log(req);
    res.end('hello');
});

app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = xConfig.debugMode ? err : {};
    res.status(err.status || 500);
    res.render('error.ejs');
});

module.exports = app;
