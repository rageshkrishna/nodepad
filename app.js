
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var expressValidator = require('express-validator');
var connectTimeout = require('connect-timeout');

var timeout = connectTimeout({ time: 5000 });
var errorHandler = require("./middleware/errorHandler");
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.bodyParser());
app.use(expressValidator());
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(timeout);
app.use(app.router);
app.use(require('less-middleware')({ src: path.join(__dirname, 'public') }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(errorHandler);
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.home.index);
app.get('/new', routes.home.newNote);
app.post('/create', routes.home.create);
mongoose.connect('mongodb://localhost/nodepad');
var shouldRetry = true;

mongoose.connection.on('error', function(error) {
    console.error("Mongodb connection error:  " + error);
    if (shouldRetry) {
        setTimeout(function() {
            mongoose.connect('mongodb://localhost/nodepad');
        }, 1000);
    }
    //process.exit(1);
});


mongoose.connection.once('open', function() {
    shouldRetry = false;
    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express server listening on port ' + app.get('port'));
    });
});
