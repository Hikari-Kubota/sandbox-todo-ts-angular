var app = angular.module('app', []);
app.directive('todoList', [function () {
        return {
            restrict: 'EA',
            replace: true,
            scope: {
                todoItems: '=',
            },
            templateUrl: '../../list_template.html',
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
                    console.log(itemId);
                    var index;
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