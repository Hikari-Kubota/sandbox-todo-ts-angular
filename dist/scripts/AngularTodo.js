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
var HeaderController = (function () {
    function HeaderController() {
        this.date = new Date();
    }
    return HeaderController;
}());
exports.HeaderController = HeaderController;
var TodoController = (function () {
    function TodoController($scope) {
        var _this = this;
        this.$scope = $scope;
        this.index = 0;
        this.priorities = [];
        this.filterPriorities = [];
        this.initLocalStorage();
        this.todoItems = this.loadTodoItems();
        this.priorities = [
            { level: 1, name: "High", color: "warning" },
            { level: 2, name: "Normal", color: "default" },
            { level: 3, name: "Low", color: "success" },
        ];
        this.priority = this.priorities[1];
        this.filterPriorities = [{ level: -1, name: "Importance", color: "default" }];
        this.filterPriorities = this.filterPriorities.concat(this.priorities);
        this.filterConditions = { word: "", priority: this.filterPriorities[0], status: "", start: "", end: "" };
        this.date = "";
        $scope.$watch(function () { return _this.todoItems; }, function (newVal, oldVal) {
            _this.saveTodoItems(newVal);
        }, true);
    }
    TodoController.prototype.initLocalStorage = function () {
        if (localStorage["maxId"] == null) {
            localStorage["maxId"] = 0;
        }
        if (localStorage["todoItems"] == null) {
            localStorage["todoItems"] = [];
        }
    };
    TodoController.prototype.setId = function (id) {
        localStorage["maxId"] = id;
    };
    TodoController.prototype.getId = function () {
        var id = parseInt(localStorage["maxId"]);
        return ++id;
    };
    TodoController.prototype.checkAllItems = function () {
        var done;
        var filteredTodo = [];
        if (this.checkAll) {
            done = true;
        }
        else {
            done = false;
        }
        var todoFilter = new TodoFilter();
        filteredTodo = todoFilter.filter(this.todoItems, this.filterConditions);
        for (var _i = 0, filteredTodo_1 = filteredTodo; _i < filteredTodo_1.length; _i++) {
            var value = filteredTodo_1[_i];
            value.done = done;
        }
    };
    TodoController.prototype.addTodoItem = function (msg, pr, date) {
        var maxId = this.getId();
        this.todoItems.push({
            id: maxId,
            message: msg,
            done: false,
            isEditMode: false,
            priority: pr,
            deadline: date
        });
        this.message = '';
        this.setId(maxId);
        this.date = "";
        this.priority = this.priorities[1];
    };
    TodoController.prototype.removeTodoItem = function (id) {
        var index = 0;
        for (var _i = 0, _a = this.todoItems; _i < _a.length; _i++) {
            var value = _a[_i];
            if (value.id == id)
                break;
            index++;
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
    TodoController.prototype.resetFilter = function () {
        this.filterConditions = { word: "", priority: this.filterPriorities[0], status: "", start: "", end: "" };
    };
    TodoController.prototype.deleteDoneItems = function () {
        var doneId = [];
        var doneIdNum;
        for (var _i = 0, _a = this.todoItems; _i < _a.length; _i++) {
            var value = _a[_i];
            if (value.done == true) {
                doneId.push(value.id);
            }
        }
        doneIdNum = doneId.length;
        if (doneIdNum > 0) {
            if (window.confirm("Do you want to delete Done ToDo items?")) {
                for (var _b = 0, doneId_1 = doneId; _b < doneId_1.length; _b++) {
                    var id = doneId_1[_b];
                    this.removeTodoItem(id);
                }
                if (doneIdNum == 1) {
                    alert("A Done Item has been successfully deleted.");
                }
                else {
                    alert(doneIdNum + " Done Items have been successfully deleted.");
                }
            }
        }
        else {
            alert("There is no Done Item.");
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
        this.template = "\n        <div class=\"list-group-item\">\n            <div class=\"list-group-item-inner done-{{todoItem.done}}\" ng-hide=\"isEditMode\">\n                <div class=\"item-wrapper\">\n                    <input type=\"checkbox\" ng-model=\"todoItem.done\"/>\n                </div>\n                <label class=\"todo-label\" ng-dblclick=\"startEdit(todoItem.id)\">{{todoItem.message}}</label>\n                <label class=\"deadline-label deadline-color-{{getDeadlineColor(todoItem)}}\" ng-dblclick=\"startEdit(todoItem.id)\">\n                    {{todoItem.deadline}}\n                    <span class=\"glyphicon glyphicon-warning-sign\" ng-show=\"getDeadlineColor(todoItem)=='danger'\"></span>\n                </label>\n                <span class=\"label btn-{{todoItem.priority.color}} label-done-{{todoItem.done}} importance-label\" ng-dblclick=\"startEdit(todoItem.id)\">{{todoItem.priority.name}}</span>\n                <div class=\"item-wrapper\">\n                    <button class=\"btn btn-danger btn-sm\" ng-click=\"removeTodoItem(todoItem.id)\">&times;</button>\n                </div>\n            </div>\n            <div ng-show=\"isEditMode\">\n                <form name=\"todoEditForm\" novalidate>\n                    <div class=\"input-group input-group-lg\">\n                        <input type=\"text\" name=\"todoEdit\" class=\"form-control\" ng-model=\"todoItem.message\" ng-blur=\"updateTodoItem($event, todoItem)\" ng-keyup=\"updateTodoItem($event, todoItem)\" placeholder=\"ToDo ...\" />\n                        <span class=\"input-group-btn\">\n                            <button class=\"btn btn-primary\" ng-click=\"updateTodoItem($event, todoItem)\">\n                                <span class=\"glyphicon glyphicon-refresh\"></span>\n                            </button>\n                        </span>\n                    </div>\n                    <div class=\"todo-option\">\n                        <input type=\"text\" class=\"datepicker date-box\" ng-model=\"todoItem.deadline\" placeholder=\"Deadline ...\">\n                        <span class=\"glyphicon glyphicon-calendar\"></span>\n                        <script>\n                            $('.datepicker').datepicker({\n                                autoclose: true,\n                                todayHighlight: true,\n                                clearBtn: true\n                            })\n                        </script>\n                        <select class=\"btn-{{todoItem.priority.color}} select-box\" ng-model=\"todoItem.priority\" ng-options=\"pr.name for pr in c.priorities\" novalidate=\"\"></select>\n                        <span class=\"glyphicon glyphicon-exclamation-sign\"></span>\n                    </div>\n                </form>\n            </div>\n        </div>\n        ";
        this.link = function (scope, element, attrs, todoController) {
            scope.isEditMode = false;
            scope.startEdit = function (id) {
                scope.isEditMode = true;
            };
            scope.updateTodoItem = function ($event, todoItem) {
                if ($event.type === 'keyup') {
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
            scope.getDeadlineColor = function (todoItem) {
                var deadline = todoItem.deadline;
                if (deadline == "")
                    return;
                if (todoItem.done == true)
                    return "gray";
                var dead = new Date(deadline).getTime();
                var today = new Date().getTime();
                var msDiff = dead - today;
                var daysDiff = Math.floor(msDiff / (1000 * 60 * 60 * 24)) + 1;
                if (daysDiff < 0) {
                    return "danger";
                }
                else if (daysDiff == 0) {
                    return "warning";
                }
                else if (daysDiff < 3) {
                    return "info";
                }
                else {
                    return "";
                }
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
            var periodResult = true;
            if (todo.message.indexOf(fc.word) == -1)
                wordResult = false;
            if (todo.message == "")
                wordResult = true;
            if (todo.priority.name != fc.priority.name)
                priorityResult = false;
            if (fc.priority.name == "Importance")
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
            var start = fc.start != "" ? new Date(fc.start).getTime() : 0;
            var end = fc.end != "" ? new Date(fc.end).getTime() : 9999999999999;
            var deadline = todo.deadline != "" ? new Date(todo.deadline).getTime() : 1;
            if (deadline <= end && deadline >= start || deadline == 1) {
                periodResult = true;
            }
            else {
                periodResult = false;
            }
            return wordResult && priorityResult && statusResult && periodResult;
            ;
        });
    };
    return TodoFilter;
}());
exports.TodoFilter = TodoFilter;
