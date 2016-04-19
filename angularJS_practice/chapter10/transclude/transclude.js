var app = angular.module('app', []);

app.directive('transcludeTrue', function() {
    return {
        restrict: 'E',
        transclude: true,
        template: '<div><span ng-transclude/></div>'
    }
});

app.directive('transcludeFalse', function() {
    return {
        restrict: 'E',
        transclude: false,
        template: '<div></div>'
    }
});
