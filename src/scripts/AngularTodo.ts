export interface ITodoItemDirectiveScope extends ng.IScope {
    isEditMode: boolean;
    startEdit: Function;
    updateTodoItem: Function;
    cancelEdit: Function;
    removeTodoItem: Function;
}

export class TodoItem {
    id: number;
    message: string;
    done: boolean;
    isEditMode: boolean;
    priority: string;
}

export class TodoController {
    private index = 0;
    public todoItems: TodoItem[];
    public message: string;
    public priorities = [];
    public priority: string;
    static $inject = ['$scope'];

    constructor(private $scope: ng.IScope) {
        this.todoItems = this.loadTodoItems();
        this.priorities = [
            {l: 0, p: "Now!", c: "danger"},
            {l: 1, p: "High", c: "warning"},
            {l: 2, p: "Normal", c: "info"},
            {l: 3, p: "Low", c: "success"},
            {l: 4, p: "Sometime...", c: "primary"},
        ];
        this.priority = this.priorities[2];
        // deep watch
        $scope.$watch(() => { return this.todoItems; },
            (newVal, oldVal) => {
                this.saveTodoItems(newVal);
            }, true);
    }
    public addTodoItem(msg: string, pr: string) {
        this.todoItems.push({
            id: this.index,
            message: msg,
            done: false,
            isEditMode: false,
            priority: pr
        });
        this.message = '';
        this.index++;
    }
    public removeTodoItem(id: number) {
        let index = 0;
        for (let i = 0; i < this.todoItems.length; i++) {
            if (this.todoItems[i].id === id) {
                index = i;
                break;
            }
        }
        this.todoItems.splice(index, 1);
    }
    public remaining(): number {
        let count = 0;
        this.todoItems.forEach((todoItem) => {
            count += todoItem.done ? 1 : 0;
        });
        return count;
    }
    public saveTodoItems(_todoItems: TodoItem[]):void {
        localStorage["todoItems"] = JSON.stringify(_todoItems);
    }
    public loadTodoItems(): TodoItem[] {
        if (localStorage["todoItems"]){
            return JSON.parse(localStorage["todoItems"]);
        } else {
            return [];
        }
    }

}

export class TodoListDirective implements ng.IDirective {
    public restrict: string;
    public controller: string;
    public controllerAs: string;
    public bindToController: boolean;

    constructor() {
        this.restrict = 'E';
        this.controller = 'todoController';
        this.controllerAs = 'c';
        this.bindToController = true;
    }
    public static Factory(): ng.IDirectiveFactory {
        const directive = ()=> {
            return new TodoListDirective();
        }
        directive.$inject = [];
        return directive;
    }
}

export class TodoItemDirective implements ng.IDirective {
    public restrict: string;
    public replace: boolean;
    public require: string;
    public template: string;
    public link: (scope: ITodoItemDirectiveScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, todoController: TodoController) => void;

    constructor() {
        this.restrict = 'E';
        this.replace = true;
        this.require = '^todoList';
        this.template = `<div class="list-group-item">
                            <div class="list-group-item-inner done-{{todoItem.done}}" ng-hide="isEditMode">
                                <div class="item-wrapper"><input type="checkbox" ng-model="todoItem.done" /></div>
                                <label ng-dblclick="startEdit(todoItem.id)">{{todoItem.message}}</label>
                                <span class="label label-{{todoItem.priority.c}} label-done-{{todoItem.done}}" ng-dblclick="startEdit(todoItem.id)">{{todoItem.priority.p}}</span>
                                <div class="item-wrapper"><button class="btn btn-danger btn-sm" ng-click="removeTodoItem(todoItem.id)">&times;</button></div>
                            </div>
                            <div ng-show="isEditMode">
                                <form name="todoEditForm" novalidate>
                                    <div class="input-group input-group-lg">
                                        <input type="text" name="todoEdit" class="form-control" ng-model="todoItem.message" ng-blur="updateTodoItem($event, todoItem)" ng-keyup="updateTodoItem($event, todoItem)" placeholder="ToDo ..." />
                                        <div class="input-group-addon">
                                            <select ng-model="todoItem.priority" ng-options="pr.p for pr in c.priorities" novalidate=""></select>
                                        </div>
                                        <span class="input-group-btn">
                                            <button class="btn btn-primary" ng-click="updateTodoItem($event, todoItem)">Update</button>
                                        </span>
                                    </div>
                                </form>
                            </div>
                        </div>`;
        this.link = (scope: ITodoItemDirectiveScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, todoController: TodoController) => {
            scope.isEditMode = false;

            // 編集モードの開始
            scope.startEdit = (id) => {
                scope.isEditMode = true;
            };
            // 編集終了
            scope.updateTodoItem = ($event, todoItem) => {
                if ($event.type === 'keyup') {
                    if ($event.which !== 13) return;
                }/* else if ($event.type !== 'blur') {
                    return;
                }*/
                if (todoItem.message == "") {
                    scope.removeTodoItem(todoItem.id);
                }
                scope.isEditMode = false;
                $event.stopPropagation();
            };
            // 編集キャンセル
            scope.cancelEdit = () => {
                if (!scope.isEditMode) return;
                scope.isEditMode = false;
            };
            // Todo アイテムを削除
            scope.removeTodoItem = (id) => {
                todoController.removeTodoItem(id);
            };
        }
    }
    public static Factory(): ng.IDirectiveFactory {
        const directive = ()=> {
            return new TodoItemDirective();
        }
        directive.$inject = [];
        return directive;
    }
}

export class TodoFocusDirective implements ng.IDirective {
    public link: (scope: any, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;

    constructor($timeout) {
        this.link = (scope: any, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
            scope.$watch('isEditMode', (newVal) => {
                $timeout(() => {
                    element[0].focus();
                }, 0, false);
            });
        }
    }
    public static Factory(): ng.IDirectiveFactory {
        const directive = ($timeout) => {
            return new TodoFocusDirective($timeout);
        }
        directive.$inject = ['$timeout'];
        return directive;
    }
}
