/// <reference path="../../typings/main.d.ts"/>

var app = angular.module('app', []);

app.directive('todoList', [()=> {
    return {
        restrict: 'EA',
        replace: true,
        scope: {
            todoItems: '=',
        },
        templateUrl: '../../list_template.html',
        link: (scope: any, iElement: any)=> {
            // todoItem を更新
            scope.update = ($event: any, todoItem: any) => {
                var message = window.prompt('変更', todoItem.message);
                if (message) {
                    var t: any;
                    for (var i = 0; i < scope.todoItems.length; i++) {
                        t = scope.todoItems[i];
                        if (t.id == todoItem.id) {
                            t.message = message;
                            break;
                        }
                    }
                }
            };
            // todoItem を削除
            scope.delete = ($event: any, itemId: number) => {
                console.log(itemId);
                var index: number;
                var t: any;
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
    }
}]);

app.controller('todoController', ['$scope', ($scope: any) => {
    $scope.todoItems = [];
    $scope.message = '';
    var index = 0;
    // todoItem を追加
    $scope.addTodoItem = (msg: string) => {
        $scope.todoItems.push({
            id: index,
            message: msg,
            done: false
        });
        $scope.message = '';
        index++;
    };
    // 完了アイテム数を取得
    $scope.remaining = () => {
        var count = 0;
        $scope.todoItems.forEach((todo: any) => {
            count += todo.done;
        });
        return count;
    };
}]);

/* #1. コントローラと HTML 要素だけのシンプルな構成
app.controller('todoController', ['$scope', ($scope: any) => {
    $scope.todoItems = [];
    $scope.message = '';
    var index = 0;

    // todoItem を追加
    $scope.addToDoItem = (msg: any) => {
        $scope.todoItems.push({
            id: index,
            message: msg,
            done: false
        });
        $scope.message = '';
        index++;
    };

    // todoItem を更新
    $scope.updateTodoItem = (todoItem: any) => {
        var message = window.prompt('変更', todoItem.message);
        if (message) {
            var t: any;
            for (var i = 0; i < $scope.todoItems.length; i++){
                t = $scope.todoItems[i];
                if (t.id == todoItem.id) {
                    t.message = message;
                    break;
                }
            }
        }
    };

    // todoItem を削除
    $scope.removeTodoItem = (id: any) => {
        var index = 1;
        var t: any;
        for (var i = 0; i < $scope.todoItems.length; i++) {
            t = $scope.todoItems[i];
            if (t.id == id) {
                index = i;
                break;
            }
        }
        $scope.todoItems.splice(index, 1);
    };

    // 完了アイテム数を取得
    $scope.remaining = () => {
        var count = 0;
        $scope.todoItems.forEach((todo: any) => {
            count += todo.done;
        });
        return count;
    };

}]);
*/
