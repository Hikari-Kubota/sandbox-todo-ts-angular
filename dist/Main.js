var app = angular.module('app', []);
app.controller('todoController', ['$scope', function ($scope) {
        var index = 0;
        $scope.todoItems = [];
        $scope.addTodoItem = function (msg) {
            $scope.todoItems.push({
                id: index,
                message: msg,
                done: false
            });
            index++;
            $scope.message = '';
        };
        this.removeTodoItem = function (todoItem) {
            var index = 0;
            var t;
            for (var i = 0; i < $scope.todoItems.length; i++) {
                t = $scope.todoItems[i];
                if (t.id == todoItem.id) {
                    index = i;
                    break;
                }
            }
            $scope.todoItems.splice(index, 1);
        };
        this.cancelAll = function () {
            $scope.todoItems.forEach(function (todoItem) {
                if (todoItem.isEditMode) {
                    todoItem.cancel();
                }
            });
        };
        $scope.remaining = function () {
            var count = 0;
            $scope.todoItems.forEach(function (item) {
                count += item.done;
            });
            return count;
        };
    }]);
app.directive('todoList', function () {
    return {
        restrict: 'EA',
        replace: true,
        controller: 'todoController'
    };
});
app.directive('todoItem', function () {
    return {
        restrict: 'EA',
        require: '^todoList',
        replace: true,
        template: '<div class="list-group-item">' +
            '<div class="list-group-item-inner" ng-hide="isEditMode">' +
            '<div class="item-wrapper"><input type="checkbox" ng-model="todo.done" /></div>' +
            '<label class="done-{{todo.done}}" ng-dblclick="startEdit(todo)">{{todo.message}}</label>' +
            '<div class="item-wrapper"><button class="btn btn-danger btn-xs" ng-click="delete(todo)">&times;</button></div>' +
            '</div>' +
            '<div ng-show="isEditMode">' +
            '<input ng-model="todo.message" class="form-control input-sm" todo-focus ng-blur="updateTodoItem($event)" ng-keyup="updateTodoItem($event)" />' +
            '</div>' +
            '</div>',
        scope: {
            todo: '='
        },
        link: function (scope, element, attrs, TodoController) {
            scope.isEditMode = false;
            scope.startEdit = function (todo) {
                TodoController.cancelAll();
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
            scope.cancel = function () {
                if (!scope.isEditMode)
                    return;
                scope.isEditMode = false;
            };
            scope.delete = function (todo) {
                TodoController.removeTodoItem(todo);
            };
        }
    };
});
app.directive('todoFocus', function ($timeout) {
    return {
        link: function (scope, element, attrs) {
            scope.$watch('isEditMode', function (newVal) {
                $timeout(function () {
                    element[0].focus();
                }, 0, false);
            });
        }
    };
});
//# sourceMappingURL=Main.js.map