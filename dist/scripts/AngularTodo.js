"use strict";
var TodoItem = (function () {
    function TodoItem() {
    }
    return TodoItem;
}());
exports.TodoItem = TodoItem;
var TodoController = (function () {
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
var PriorityDirective = (function () {
    function PriorityDirective() {
        this.max = 3;
        this.restrict = "E";
        this.replace = true;
        this.require = "ngModel";
        this.template = '<span>☆☆☆</span>';
        this.link = function (scope, element, attrs, todoController) {
        };
    }
    PriorityDirective.Factory = function () {
        var directive = function () {
            return new PriorityDirective();
        };
        directive.$inject = [];
        return directive;
    };
    return PriorityDirective;
}());
exports.PriorityDirective = PriorityDirective;
var TodoItemDirective = (function () {
    function TodoItemDirective() {
        this.restrict = 'E';
        this.replace = true;
        this.require = '^todoList';
        this.template = "<div class=\"list-group-item\">\n                            <div class=\"list-group-item-inner\" ng-hide=\"isEditMode\">\n                                <div class=\"item-wrapper\"><input type=\"checkbox\" ng-model=\"todoItem.done\" /></div>\n                                <label class=\"done-{{todoItem.done}}\" ng-dblclick=\"startEdit(todoItem.id)\">{{todoItem.message}}</label>\n                                <div class=\"item-wrapper\"><button class=\"btn btn-danger btn-xs\" ng-click=\"removeTodoItem(todoItem.id)\">&times;</button></div>\n                            </div>\n                            <div ng-show=\"isEditMode\">\n                                <input ng-model=\"todoItem.message\" class=\"form-control input-sm\" todo-focus ng-blur=\"updateTodoItem($event, todoItem)\" ng-keyup=\"updateTodoItem($event, todoItem)\" />\n                            </div>\n                        </div>";
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
                else if ($event.type !== 'blur') {
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
