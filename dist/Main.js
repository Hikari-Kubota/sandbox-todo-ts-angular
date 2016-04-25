var app = angular.module('app', []);
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
        $scope.updateTodoItem = function (todoItem) {
            var message = window.prompt('変更', todoItem.message);
            if (message) {
                var t;
                for (var i = 0; i < $scope.todoItems.length; i++) {
                    t = $scope.todoItems[i];
                    if (t.id == todoItem.id) {
                        t.message = message;
                        break;
                    }
                }
            }
        };
        $scope.removeTodoItem = function (id) {
            var index = 1;
            var t;
            for (var i = 0; i < $scope.todoItems.length; i++) {
                t = $scope.todoItems[i];
                if (t.id == id) {
                    index = i;
                    break;
                }
            }
            $scope.todoItems.splice(index, 1);
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