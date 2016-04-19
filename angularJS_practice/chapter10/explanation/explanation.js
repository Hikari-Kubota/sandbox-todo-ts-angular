var app = angular.module('app', []);

app.directive('myDirective', function() {
    return {
        compile: function(tElement, tAttrs, tTransclude) {
            tElement.text('This is my favorite directive!');
            return function link(scope, iElement, iAttrs, controller, iTransclude) {
                scope.$watch('message', function(newVal) {
                    tElement.text(newVal);
                });
            }
        }
    }
});
