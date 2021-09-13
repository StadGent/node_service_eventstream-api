import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import debugLogger from 'debug';
import http from 'http';
import routes from './routes/all';
import docs from './routes/docs';
import correlatorExpress from 'express-correlation-id';
import Utils from './lib/utils';

const app = express();
const debug = debugLogger('adlib2eventstream:server');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: function (res, path) {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Allow", "GET");
    res.set("Content-Language", "nl");
  }
}));
app.use(correlatorExpress());

app.use('/api-docs', docs);
app.use('/', routes);

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
const port = normalizePort(process.env.EVENTSTREAM_SERVERPORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

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
  const port = parseInt(val, 10);

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

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      Utils.log(bind + ' requires elevated privileges', "adlib-backend/app.js:onError", "ERROR", null);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      Utils.log(bind + ' is already in use', "adlib-backend/app.js:onError", "ERROR", null);
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
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  Utils.log("Listening on " + bind, "adlib-backend:app.js:onListening", "INFO", null);
}

export default app; // TODO: why export this?
