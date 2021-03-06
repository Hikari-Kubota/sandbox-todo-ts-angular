export interface ITodoItemDirectiveScope extends ng.IScope {
    isEditMode: boolean;
    startEdit: Function;
    updateTodoItem: Function;
    cancelEdit: Function;
    removeTodoItem: Function;
    getDeadlineColor: Function;
}

export class TodoItem {
    id: number;
    message: string;
    done: boolean;
    isEditMode: boolean;
    priority: Priority;
    deadline: string;
}

export class FilterConditions {
    word: string;
    priority: Priority;
    status: string;
    start: string;
    end: string;
}

export class Priority {
    level: number;
    name: string;
    color: string;
}

export class HeaderController {
    public date: Date;
    public test: string;
    constructor() {
        this.date = new Date();
    }
}

export class TodoController {
    private index = 0;
    public todoItems: TodoItem[];
    public filterConditions: FilterConditions;
    public message: string;
    public priorities = [];
    public filterPriorities = [];
    public priority: Priority;
    static $inject = ['$scope'];
    public checkAll: boolean;
    public date: string;

    constructor(private $scope: ng.IScope) {

        // localStorage の初期化
        this.initLocalStorage();

        this.todoItems = this.loadTodoItems();

        // this.todoItems = []; // ToDoリストをリセット

        // 優先度メニューの値をセット
        this.priorities = [
            //{ level: 0, name: "Now!", color: "danger" },
            { level: 1, name: "High", color: "warning" },
            { level: 2, name: "Normal", color: "default" },
            { level: 3, name: "Low", color: "success" },
            //{ level: 4, name: "Sometime...", color: "primary" },
        ];
        this.priority = this.priorities[1]; // Normal

        // フィルターの設定
        this.filterPriorities = [{level: -1, name: "Importance", color: "default"}];
        this.filterPriorities = this.filterPriorities.concat(this.priorities);
        this.filterConditions = {word: "", priority: this.filterPriorities[0], status: "", start: "", end: ""};

        this.date = "";

        // deep watch
        $scope.$watch(() => { return this.todoItems; },
            (newVal, oldVal) => {
                this.saveTodoItems(newVal);
            }, true);

    }

    public initLocalStorage() {
        if (localStorage["maxId"] == null) {
            localStorage["maxId"] = 0;
        }
        if (localStorage["todoItems"] == null) {
            localStorage["todoItems"] = [];
        }
    }

    public setId(id: number) {
        localStorage["maxId"] = id;
    }

    public getId() {
        let id = parseInt(localStorage["maxId"]);
        return ++id;
    }

    public checkAllItems() {
        let done: boolean;
        let filteredTodo = []
        if (this.checkAll){
            done = true;
        } else {
            done = false;
        }

        let todoFilter = new TodoFilter();

        filteredTodo = todoFilter.filter(this.todoItems, this.filterConditions);

        for (let value of filteredTodo){
            value.done = done;
        }

    }

    public addTodoItem(msg: string, pr: Priority, date: string) {
        let maxId = this.getId();

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
        this.priority = this.priorities[1];   // Normal

    }

    public removeTodoItem(id: number) {
        let index = 0;
        for (let value of this.todoItems) {
            if (value.id == id) break;
            index++;
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

    public saveTodoItems(_todoItems: TodoItem[]): void {
        localStorage["todoItems"] = JSON.stringify(_todoItems);
    }

    public loadTodoItems(): TodoItem[] {
        if (localStorage["todoItems"]) {
            return JSON.parse(localStorage["todoItems"]);
        } else {
            return [];
        }
    }

    public resetFilter() {
        this.filterConditions = {word: "", priority: this.filterPriorities[0], status: "", start: "", end: ""};
    }

    public deleteDoneItems() {
        let doneId = [];
        let doneIdNum: number;
        for (let value of this.todoItems) {
            if (value.done == true) {
                doneId.push(value.id);
            }
        }
        doneIdNum = doneId.length;
        if (doneIdNum > 0) {
            if (window.confirm("Do you want to delete Done ToDo items?")) {
                for (let id of doneId) {
                    this.removeTodoItem(id);
                }
                if (doneIdNum == 1) {
                    alert("A Done Item has been successfully deleted.");
                } else {
                    alert(`${doneIdNum} Done Items have been successfully deleted.`);
                }

            }
        } else {
            alert("There is no Done Item.");
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
        const directive = () => {
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
        this.template = `
        <div class="list-group-item">
            <div class="list-group-item-inner done-{{todoItem.done}}" ng-hide="isEditMode">
                <div class="item-wrapper">
                    <input type="checkbox" ng-model="todoItem.done"/>
                </div>
                <label class="todo-label" ng-dblclick="startEdit(todoItem.id)">{{todoItem.message}}</label>
                <label class="deadline-label deadline-color-{{getDeadlineColor(todoItem)}}" ng-dblclick="startEdit(todoItem.id)">
                    {{todoItem.deadline}}
                    <span class="glyphicon glyphicon-warning-sign" ng-show="getDeadlineColor(todoItem)=='danger'"></span>
                </label>
                <span class="label btn-{{todoItem.priority.color}} label-done-{{todoItem.done}} importance-label" ng-dblclick="startEdit(todoItem.id)">{{todoItem.priority.name}}</span>
                <div class="item-wrapper">
                    <button class="btn btn-danger btn-sm" ng-click="removeTodoItem(todoItem.id)">&times;</button>
                </div>
            </div>
            <div ng-show="isEditMode">
                <form name="todoEditForm" novalidate>
                    <div class="input-group input-group-lg">
                        <input type="text" name="todoEdit" class="form-control" ng-model="todoItem.message" ng-blur="updateTodoItem($event, todoItem)" ng-keyup="updateTodoItem($event, todoItem)" placeholder="ToDo ..." />
                        <span class="input-group-btn">
                            <button class="btn btn-primary" ng-click="updateTodoItem($event, todoItem)">
                                <span class="glyphicon glyphicon-refresh"></span>
                            </button>
                        </span>
                    </div>
                    <div class="todo-option">
                        <input type="text" class="datepicker date-box" ng-model="todoItem.deadline" placeholder="Deadline ...">
                        <span class="glyphicon glyphicon-calendar"></span>
                        <script>
                            $('.datepicker').datepicker({
                                autoclose: true,
                                todayHighlight: true,
                                clearBtn: true
                            })
                        </script>
                        <select class="btn-{{todoItem.priority.color}} select-box" ng-model="todoItem.priority" ng-options="pr.name for pr in c.priorities" novalidate=""></select>
                        <span class="glyphicon glyphicon-exclamation-sign"></span>
                    </div>
                </form>
            </div>
        </div>
        `;
        this.link = (scope: ITodoItemDirectiveScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, todoController: TodoController) => {
            scope.isEditMode = false;

            // 編集モードの開始
            scope.startEdit = (id) => {
                scope.isEditMode = true;
            };
            // 編集終了
            scope.updateTodoItem = ($event, todoItem) => {
                if ($event.type === 'keyup') {
                    return;
                }
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
            // 期日に色付け
            scope.getDeadlineColor = (todoItem: TodoItem) => {
                let deadline = todoItem.deadline;
                if (deadline == "") return;
                if (todoItem.done == true) return "gray";
                let dead = new Date(deadline).getTime();
                let today = new Date().getTime();

                let msDiff = dead - today;
                let daysDiff = Math.floor(msDiff / (1000 * 60 * 60 * 24)) + 1;

                if (daysDiff < 0) {
                    return "danger";
                } else if (daysDiff == 0) {
                    return "warning";
                } else if (daysDiff < 3) {
                    return "info";
                } else {
                    return "";
                }

            }
        }
    }
    public static Factory(): ng.IDirectiveFactory {
        const directive = () => {
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

export class TodoFilter {

    constructor() { }

    public filter(todoItems: TodoItem[], fc: FilterConditions): TodoItem[] {
        return todoItems.filter((todo)=>{
            let wordResult = true;
            let priorityResult = true;
            let statusResult = true;
            let periodResult = true;

            // word filter
            if (todo.message.indexOf(fc.word)==-1) wordResult = false;
            if (todo.message == "") wordResult = true;

            // priority filter
            if (todo.priority.name != fc.priority.name) priorityResult = false;
            if (fc.priority.name == "Importance") priorityResult = true;

            // status filter
            if (fc.status == "active") {
                if (todo.done) {
                    statusResult = false;
                } else {
                    statusResult = true;
                }
            } else if (fc.status == "done") {
                if (todo.done) {
                    statusResult = true;
                } else {
                    statusResult = false;
                }
            }
            if (fc.status == "" || fc.status == "all") statusResult = true;

            // period filter
            let start = fc.start != "" ? new Date(fc.start).getTime() : 0;
            let end = fc.end != "" ? new Date(fc.end).getTime() : 9999999999999;
            let deadline = todo.deadline != "" ? new Date(todo.deadline).getTime() : 1;

            if (deadline <= end && deadline >= start || deadline == 1) {
                periodResult = true;
            } else {
                periodResult = false;
            }

            return wordResult && priorityResult && statusResult && periodResult;;
        });
    }
}
