const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');

const authenticate = require('./routes/authenticate');
const index = require('./routes/index');
const users = require('./routes/users');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon(path.join(__dirname, 'public', 'Candor_logo.ico')));
app.use(compression());
app.use(helmet());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

/*Sample API Usage**************************************************************************************************************************************************/

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
/******************************************************************************************************************************************************************/

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
