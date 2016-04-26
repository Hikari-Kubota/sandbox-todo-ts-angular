System.register("AngularTodo", [], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var TodoItem, TodoController, TodoListDirective, TodoItemDirective, TodoFocusDirective;
    return {
        setters:[],
        execute: function() {
            TodoItem = (function () {
                function TodoItem() {
                }
                return TodoItem;
            }());
            exports_1("TodoItem", TodoItem);
            TodoController = (function () {
                function TodoController() {
                    this.index = 0;
                    this.todoItems = [];
                }
                TodoController.prototype.addTodoItem = function (msg) {
                    this.todoItems.push({
                        id: this.index,
                        message: msg,
                        done: false,
                        isEditMode: false
                    });
                    this.message = '';
                    this.index++;
                };
                TodoController.prototype.removeTodoItem = function (id) {
                    var index = 0;
                    for (var i = 0; i < this.todoItems.length; i++) {
                        if (this.todoItems[i].id === id) {
                            index = i;
                            break;
                        }
                    }
                    this.todoItems.splice(index, 1);
                };
                TodoController.prototype.remaining = function () {
                    var count = 0;
                    this.todoItems.forEach(function (todoItem) {
                        count += todoItem.done ? 1 : 0;
                    });
                    return count;
                };
                return TodoController;
            }());
            exports_1("TodoController", TodoController);
            TodoListDirective = (function () {
                function TodoListDirective() {
                    this.restrict = 'E';
                    this.controller = 'todoController';
                    this.controllerAs = 'c';
                    this.bindToController = true;
                }
                TodoListDirective.Factory = function () {
                    var directive = function () {
                        return new TodoListDirective();
                    };
                    directive.$inject = [];
                    return directive;
                };
                return TodoListDirective;
            }());
            exports_1("TodoListDirective", TodoListDirective);
            TodoItemDirective = (function () {
                function TodoItemDirective() {
                    this.restrict = 'E';
                    this.replace = true;
                    this.require = '^todoList';
                    this.template = '<div class="list-group-item">' +
                        '<div class="list-group-item-inner" ng-hide="isEditMode">' +
                        '<div class="item-wrapper"><input type="checkbox" ng-model="todoItem.done" /></div>' +
                        '<label class="done-{{todoItem.done}}" ng-dblclick="startEdit(todoItem.id)">{{todoItem.message}}</label>' +
                        '<div class="item-wrapper"><button class="btn btn-danger btn-xs" ng-click="removeTodoItem(todoItem.id)">&times;</button></div>' +
                        '</div>' +
                        '<div ng-show="isEditMode">' +
                        '<input ng-model="todoItem.message" class="form-control input-sm" todo-focus ng-blur="updateTodoItem($event)" ng-keyup="updateTodoItem($event)" />' +
                        '</div>' +
                        '</div>';
                    this.link = function (scope, element, attrs, todoController) {
                        scope.isEditMode = false;
                        scope.startEdit = function (id) {
                            scope.isEditMode = true;
                        };
                        scope.updateTodoItem = function ($event) {
                            if ($event.type === 'keyup') {
                                if ($event.which !== 13)
                                    return;
                            }
                            else if ($event.type !== 'blur') {
                                return;
                            }
                            scope.isEditMode = false;
                            $event.stopPropagation();
                        };
                        scope.cancelEdit = function () {
                            if (!scope.isEditMode)
                                return;
                            scope.isEditMode = false;
                        };
                        scope.removeTodoItem = function (id) {
                            todoController.removeTodoItem(id);
                        };
                    };
                }
                TodoItemDirective.Factory = function () {
                    var directive = function () {
                        return new TodoItemDirective();
                    };
                    directive.$inject = [];
                    return directive;
                };
                return TodoItemDirective;
            }());
            exports_1("TodoItemDirective", TodoItemDirective);
            TodoFocusDirective = (function () {
                function TodoFocusDirective($timeout) {
                    this.link = function (scope, element, attrs) {
                        scope.$watch('isEditMode', function (newVal) {
                            $timeout(function () {
                                element[0].focus();
                            }, 0, false);
                        });
                    };
                }
                TodoFocusDirective.Factory = function () {
                    var directive = function ($timeout) {
                        return new TodoFocusDirective($timeout);
                    };
                    directive.$inject = ['$timeout'];
                    return directive;
                };
                return TodoFocusDirective;
            }());
            exports_1("TodoFocusDirective", TodoFocusDirective);
        }
    }
});
System.register("Main", ['angular', "AngularTodo"], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var angular, AngularTodo;
    var app;
    return {
        setters:[
            function (angular_1) {
                angular = angular_1;
            },
            function (AngularTodo_1) {
                AngularTodo = AngularTodo_1;
            }],
        execute: function() {
            app = angular.module('app', []);
            app.controller('todoController', [AngularTodo.TodoController]);
            app.directive('todoList', AngularTodo.TodoListDirective.Factory());
            app.directive('todoItem', AngularTodo.TodoItemDirective.Factory());
            app.directive('todoFocus', AngularTodo.TodoFocusDirective.Factory());
        }
    }
});
//# sourceMappingURL=Main.js.map