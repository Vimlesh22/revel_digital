var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
global.appRoot = path.resolve(__dirname + "/");
var app = express();
var http = require('http');
var path = require('path');
let environment = require(appRoot+"/helper/environment.js");
const os = require('os');
const cors = require('cors');
 // set Environment
 let environments = ["development", "production", "uat", "sit"];
 let envArg = process.argv.filter((args) => { return (args.indexOf('--env=') > -1) && (environments.indexOf(args.split('=')[1]) > -1); });
 if (envArg.length > 0) {
     process.env.NODE_ENV = envArg[0].split('=')[1];
 }
 if (typeof process.env.NODE_ENV == 'undefined') {
   console.log(os.hostname())
     if (environment.development.indexOf(os.hostname()) > -1) {
         process.env.NODE_ENV = "development";
     } else if (environment.uat.indexOf(os.hostname()) > -1) {
         process.env.NODE_ENV = "uat";
     } else {
         process.env.NODE_ENV = "production";
     }
 }

let config = require(path.join(global.appRoot + "/helper/config.js")).get(process.env.NODE_ENV);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
let indexRouter = require(appRoot + '/modules/routes.js');
// let validator = require(appRoot + '/helper/client_api_validator.js');
// app.use(function(req, res, next) {
//   validator.check_api_validation(req, res, next)
// });
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(config.port);
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);
  console.log(`node start on ${port} with on ${process.env.NODE_ENV} environment `)
  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
}

module.exports = app;
