var app = angular.module('app', []);
app.directive('todoList', [function () {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                todoItems: '=',
            },
            template: '<ul class="list-group">' +
                '<li class="list-group-item" ng-repeat="todoItem in todoItems">' +
                '<div class="list-group-item-inner">' +
                '<div class="item-wrapper"><input type="checkbox" ng-model="todoItem.done"></div>' +
                '<label class="done-{{todoItem.done}}" ng-dblclick="update($event, todoItem)">{{todoItem.message}}</label>' +
                '<div class="item-wrapper">' +
                '<button class="btn btn-xs btn-danger" ng-click="delete($event, todoItem.id)">&times;</button>' +
                '</div>' +
                '</div>' +
                '</li>' +
                '</ul>',
            link: function (scope, iElement) {
                scope.update = function ($event, todoItem) {
                    var message = window.prompt('変更', todoItem.message);
                    if (message) {
                        var t;
                        for (var i = 0; i < scope.todoItems.length; i++) {
                            t = scope.todoItems[i];
                            if (t.id == todoItem.id) {
                                t.message = message;
                                break;
                            }
                        }
                    }
                };
                scope.delete = function ($event, itemId) {
                    var index = 1;
                    var t;
                    for (var i = 0; i < scope.todoItems.length; i++) {
                        t = scope.todoItems[i];
                        if (t.id == itemId) {
                            index = i;
                            break;
                        }
                    }
                    scope.todoItems.splice(index, 1);
                };
            }
        };
    }]);
app.controller('todoController', ['$scope', function ($scope) {
        $scope.todoItems = [];
        $scope.message = '';
        var index = 0;
        $scope.addTodoItem = function (msg) {
            $scope.todoItems.push({
                id: index,
                message: msg,
                done: false
            });
            $scope.message = '';
            index++;
        };
        $scope.remaining = function () {
            var count = 0;
            $scope.todoItems.forEach(function (todo) {
                count += todo.done;
            });
            return count;
        };
    }]);
//# sourceMappingURL=Main.js.map