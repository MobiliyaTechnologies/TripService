'use strict';
var debug = require('debug');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var expressValidator = require('express-validator');

var fs = require('fs');

//Update config for production environment
var fileName = './src/config/config.json';
var file = require(fileName);

if (file.activeEnv == "prod") {
    if (process.env.CUSTOMCONNSTR_cosmosConnectionString != undefined) {
        file.prod.mongoDB.url = process.env.CUSTOMCONNSTR_cosmosConnectionString;
    }
    if (process.env.CUSTOMCONNSTR_redisHost != undefined) {
        file.prod.redis.host = process.env.CUSTOMCONNSTR_redisHost;
    }
    if (process.env.CUSTOMCONNSTR_redisAuthPass != undefined) {
        file.prod.redis.option.auth_pass = process.env.CUSTOMCONNSTR_redisAuthPass;
    }
    if (process.env.CUSTOMCONNSTR_iothubConnectionString != undefined) {
        file.prod.iothub.CONNECTION_STRING = process.env.CUSTOMCONNSTR_iothubConnectionString;
    }

    fs.writeFile(fileName, JSON.stringify(file), function (err) {
        if (err) return console.log(err);
    
    });
}

var trip = require('./routes/trip');
var rule = require('./routes/rule');
var dao = require('./src/dao/vehicleHistory-dao');


/**
 * Database Connection
 */
require('./src/config/databaseConnection');

var fs = require('fs');
var app = express();
var oauth = require('./src/config/authentication');
app.isAuthenticate = oauth.isAuthenticate;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(expressValidator());


/**
  *  Documentation api gateway
  */
app.get('/docs', function (req, res, next) {
    res.render('login');
})

app.use('/docs/authenticated', function (req, res, next) {

    if (req.body.username == "admin" && req.body.password == "fleet@123") {

        let a = path.join(__dirname, 'apidoc/index.html');

        fs.readFile(a, function (error, data) {
            if (error) {
                res.writeHead(404);
                res.write(error);
                res.end();
            } else {
                res.writeHead(200, {
                    'Content-Type': 'text/html'
                });

                res.write(data);
                res.end();
            }
        });

    }
    else {
        res.render('Unauthorised');
    }

});


app.use('/docs', express.static(path.join(__dirname, 'apidoc')));

// base interface
app.get('/', function (req, res, next) {
    res.end('Trip service is now running.');
});

var iotHubService = require('./src/service/iotHub-service');

iotHubService.iothubService_test.receiveData();
app.use(app.isAuthenticate);
app.use('/', trip);
app.use('/', rule);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});



// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
var portNumber = process.env.port || process.env.PORT || 3303;
app.set('port', portNumber);

var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});

/**
 * Socket
 */
//--------------------------------------------
var io = require('socket.io')(server);
module.exports.io = io;

