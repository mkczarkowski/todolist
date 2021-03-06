var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var DocumentDBClient = require('documentdb').DocumentClient;
var config = require('./config');
var TaskController = require('./routes/taskController');
var TaskModel = require('./models/taskModel');

// ustawienie ścieżki do silnika Jade odpowiadającego za wyświetlanie struktury projektu
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



var docDbClient = new DocumentDBClient(config.host, {
    masterKey: config.authKey
});
var taskModel = new TaskModel(docDbClient, config.databaseId, config.collectionId);
var taskController = new TaskController(taskModel);
taskModel.init();

app.get('/', taskController.displayTasks.bind(taskController));
app.post('/addtask', taskController.addTask.bind(taskController));
app.post('/completetask', taskController.completeTask.bind(taskController));
app.set('view engine', 'jade');

// skrypt łapiący błąd '404 Not Found' i przekazujący go do obsługi błędów
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// obsługa błędów
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // wyświetlanie błędów
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
