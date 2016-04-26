/// <reference path="../../typings/main.d.ts"/>

var app = angular.module('app', []);

app.controller('todoController', ['$scope', function($scope: any) {
    var index = 0;
    $scope.todoItems = [];

    // todoItem を追加
    $scope.addTodoItem = (msg: any) => {
        $scope.todoItems.push({
            id: index,
            message: msg,
            done: false
        });
        index++;
        $scope.message = '';
    };

    // todoItem を削除
    this.removeTodoItem = function(todoItem: any) {
        var index = 0;
        var t: any;
        for (var i = 0; i < $scope.todoItems.length; i++) {
            t = $scope.todoItems[i];
            if (t.id == todoItem.id) {
                index = i;
                break;
            }
        }
        $scope.todoItems.splice(index, 1);
    };

    // 管理している todoItem の編集モードを全てキャンセルする
    this.cancelAll = function() {
        $scope.todoItems.forEach((todoItem: any) => {
            if (todoItem.isEditMode) {
                todoItem.cancel();
            }
        });
    };
    
    // 完了アイテム数を取得
    $scope.remaining = () => {
        var count = 0;
        $scope.todoItems.forEach((item: any) => {
            count += item.done;
        });
        return count;
    };
}]);

app.directive('todoList', () => {
    return {
        restrict: 'EA',
        replace: true,
        controller: 'todoController'
    }
});

app.directive('todoItem', () => {
    return {
        restrict: 'EA',
        require: '^todoList',
        replace: true,
        // templateUrl: '../../list_template.html',
        template: '<div class="list-group-item">'+
                    '<div class="list-group-item-inner" ng-hide="isEditMode">' +
                        '<div class="item-wrapper"><input type="checkbox" ng-model="todo.done" /></div>'+
                        '<label class="done-{{todo.done}}" ng-dblclick="startEdit(todo)">{{todo.message}}</label>' +
                        '<div class="item-wrapper"><button class="btn btn-danger btn-xs" ng-click="delete(todo)">&times;</button></div>' +
                    '</div>'+
                    '<div ng-show="isEditMode">'+
                        '<input ng-model="todo.message" class="form-control input-sm" todo-focus ng-blur="updateTodoItem($event)" ng-keyup="updateTodoItem($event)" />' +
                    '</div>'+
                  '</div>',
        scope: {
            todo: '='
        },
        link: (scope: any, element: any, attrs: any, TodoController: any) => {
            scope.isEditMode = false;

            // 編集モードの開始
            scope.startEdit = (todo: any) => {
                TodoController.cancelAll();
                scope.isEditMode = true;
            };
            // 編集終了
            scope.updateTodoItem = ($event: any) => {
                if ($event.type === 'keyup') {
                    if ($event.which !== 13) return;
                } else if ($event.type !== 'blur') {
                    return;
                }
                scope.isEditMode = false;
                $event.stopPropagation();
            };
            // // 編集キャンセル
            scope.cancel = () => {
                if (!scope.isEditMode) return;
                scope.isEditMode = false;
            };
            // Todo アイテムを削除
            scope.delete = (todo: any) => {
                TodoController.removeTodoItem(todo);
            };
        }
    }
});

app.directive('todoFocus', ($timeout) => {
    return {
        link: (scope: any, element: any, attrs: any) => {
            scope.$watch('isEditMode', (newVal: any) => {
                $timeout(() => {
                    element[0].focus();
                }, 0, false);
            });
        }
    }
});
/*  #2. リスト部分をまるごとディレクティブ化する
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
*/

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
