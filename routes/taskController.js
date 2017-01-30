"use strict";
var DocumentDBClient = require('documentdb').DocumentClient;
var async = require('async');

function TaskHistory(taskModel) {
    this.taskModel = taskModel;
}

TaskHistory.prototype = {
    displayTasks: function (request, response) {
        var self = this;

        var query = {
            query: 'SELECT * FROM root'
        };

        self.taskModel.find(query, function (err, items) {
            if (err) {
                throw (err);
            }
            var toDo = [];
            var completed = [];
            items.forEach(function(item) {
               if (item.completed === true) {
                   completed.push(item);
               } else {
                   toDo.push(item);
               }
            });
            response.render('index', {
                title: 'Moje zadania',
                tasks: toDo,
                tasksCompleted: completed
            });
        });
    },

    addTask: function (request, response) {
        var self = this;
        var item = request.body;

        self.taskModel.addItem(item, function (err) {
            if (err) {
                throw (err);
            }

            response.redirect('/');
        });
    },

    completeTask: function (request, response) {
        var self = this;
        var completedTasks = Object.keys(request.body);
        async.forEach(completedTasks, function taskIterator(completedTask, callback) {
            self.taskModel.updateItem(completedTask, function (err) {
                if (err) {
                    callback(err);
                } else {
                    callback(null);
                }
            });
        }, function goHome(err) {
            if (err) {
                throw err;
            } else {
                response.redirect('/');
            }
        });
    },

};

module.exports = TaskHistory;