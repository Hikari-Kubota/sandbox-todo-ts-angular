"use strict";
var TodoItem = (function () {
    function TodoItem() {
    }
    return TodoItem;
}());
exports.TodoItem = TodoItem;
var FilterConditions = (function () {
    function FilterConditions() {
    }
    return FilterConditions;
}());
exports.FilterConditions = FilterConditions;
var Priority = (function () {
    function Priority() {
    }
    return Priority;
}());
exports.Priority = Priority;
var TodoController = (function () {
    function TodoController($scope) {
        var _this = this;
        this.$scope = $scope;
        this.index = 0;
        this.priorities = [];
        this.filterPriorities = [];
        this.todoItems = this.loadTodoItems();
        this.priorities = [
            { level: 0, name: "Now!", color: "danger" },
            { level: 1, name: "High", color: "warning" },
            { level: 2, name: "Normal", color: "info" },
            { level: 3, name: "Low", color: "success" },
            { level: 4, name: "Sometime...", color: "primary" },
        ];
        this.priority = this.priorities[2];
        this.filterPriorities = [{ level: -1, name: "--Priority--", color: "" }];
        this.filterPriorities = this.filterPriorities.concat(this.priorities);
        this.filterConditions = { word: "", priority: this.filterPriorities[0], status: "" };
        this.filterConditions.priority = this.filterPriorities[0];
        $scope.$watch(function () { return _this.todoItems; }, function (newVal, oldVal) {
            _this.saveTodoItems(newVal);
        }, true);
    }
    TodoController.prototype.addTodoItem = function (msg, pr) {
        this.todoItems.push({
            id: this.index,
            message: msg,
            done: false,
            isEditMode: false,
            priority: pr
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
    TodoController.prototype.saveTodoItems = function (_todoItems) {
        localStorage["todoItems"] = JSON.stringify(_todoItems);
    };
    TodoController.prototype.loadTodoItems = function () {
        if (localStorage["todoItems"]) {
            return JSON.parse(localStorage["todoItems"]);
        }
        else {
            return [];
        }
    };
    TodoController.$inject = ['$scope'];
    return TodoController;
}());
exports.TodoController = TodoController;
var TodoListDirective = (function () {
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
exports.TodoListDirective = TodoListDirective;
var TodoItemDirective = (function () {
    function TodoItemDirective() {
        this.restrict = 'E';
        this.replace = true;
        this.require = '^todoList';
        this.template = "\n        <div class=\"list-group-item\">\n            <div class=\"list-group-item-inner done-{{todoItem.done}}\" ng-hide=\"isEditMode\">\n                <div class=\"item-wrapper\">\n                    <input type=\"checkbox\" ng-model=\"todoItem.done\" />\n                </div>\n                <label ng-dblclick=\"startEdit(todoItem.id)\">{{todoItem.message}}</label>\n                <span class=\"label label-{{todoItem.priority.color}} label-done-{{todoItem.done}}\" ng-dblclick=\"startEdit(todoItem.id)\">{{todoItem.priority.name}}</span>\n                <div class=\"item-wrapper\">\n                    <button class=\"btn btn-danger btn-sm\" ng-click=\"removeTodoItem(todoItem.id)\">&times;</button>\n                </div>\n            </div>\n            <div ng-show=\"isEditMode\">\n                <form name=\"todoEditForm\" novalidate>\n                    <div class=\"input-group input-group-lg\">\n                        <input type=\"text\" name=\"todoEdit\" class=\"form-control\" ng-model=\"todoItem.message\" ng-blur=\"updateTodoItem($event, todoItem)\" ng-keyup=\"updateTodoItem($event, todoItem)\" placeholder=\"ToDo ...\" />\n                        <div class=\"input-group-addon\">\n                            <select ng-model=\"todoItem.priority\" ng-options=\"pr.name for pr in c.priorities\" novalidate=\"\"></select>\n                        </div>\n                        <span class=\"input-group-btn\">\n                            <button class=\"btn btn-primary\" ng-click=\"updateTodoItem($event, todoItem)\">Update</button>\n                        </span>\n                    </div>\n                </form>\n            </div>\n        </div>\n        ";
        this.link = function (scope, element, attrs, todoController) {
            scope.isEditMode = false;
            scope.startEdit = function (id) {
                scope.isEditMode = true;
            };
            scope.updateTodoItem = function ($event, todoItem) {
                if ($event.type === 'keyup') {
                    if ($event.which !== 13)
                        return;
                }
                if (todoItem.message == "") {
                    scope.removeTodoItem(todoItem.id);
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
exports.TodoItemDirective = TodoItemDirective;
var TodoFocusDirective = (function () {
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
exports.TodoFocusDirective = TodoFocusDirective;
var TodoFilter = (function () {
    function TodoFilter() {
    }
    TodoFilter.prototype.filter = function (todoItems, fc) {
        return todoItems.filter(function (todo) {
            var wordResult = true;
            var priorityResult = true;
            var statusResult = true;
            if (todo.message.indexOf(fc.word) == -1)
                wordResult = false;
            if (todo.message == "")
                wordResult = true;
            if (todo.priority.name != fc.priority.name)
                priorityResult = false;
            if (fc.priority.name == "--Priority--")
                priorityResult = true;
            if (fc.status == "active") {
                if (todo.done) {
                    statusResult = false;
                }
                else {
                    statusResult = true;
                }
            }
            else if (fc.status == "done") {
                if (todo.done) {
                    statusResult = true;
                }
                else {
                    statusResult = false;
                }
            }
            if (fc.status == "" || fc.status == "all")
                statusResult = true;
            return wordResult && priorityResult && statusResult;
        });
    };
    return TodoFilter;
}());
exports.TodoFilter = TodoFilter;
