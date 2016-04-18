angular.module('app', []).directive("myDirective", function() {
    return {
        template: "<span>{{ctrl.message}}</span>",  // ctrl: controller の別名 
        controller: function() {
            this.message = "Hello, World!";
        },
        controllerAs: "ctrl"
    }
});
