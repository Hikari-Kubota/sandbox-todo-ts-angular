/// <reference path="../../typings/main.d.ts"/>

import angular = require('angular');

var app = angular.module('app', []);

import AngularTodo = require('./AngularTodo');
app.controller('todoController', [AngularTodo.TodoController]);
app.directive('todoList', AngularTodo.TodoListDirective.Factory());
app.directive('todoItem', AngularTodo.TodoItemDirective.Factory());
app.directive('todoFocus', AngularTodo.TodoFocusDirective.Factory());
