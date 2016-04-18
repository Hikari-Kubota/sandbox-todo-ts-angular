var app = angular.module('app', []);

app.controller('MyController', ['$scope', function($scope) {
    $scope.greeting = 'Hello, World!';
    $scope.do_something = function() {
        $scope.greeting = 'Goodbye, World!';
    };
}]);

app.directive('scopeFalse', function() {
    return {
        scope: false,
        template: '<pre>{{greeting}}</pre>'
    }
});

app.directive('scopeIsolated', function() {
    return {
        restrict: 'E',
        scope: {
            message: '=myMessage',
            name: '@myName',
            action: '&myAction'
        },
        template: '<pre title="{{name}}">{{message}}</pre><button ng-click="action()">push</button>'
    }
});

app.directive('scopeTrue', function() {
    return {
        scope: true,
        template: '<pre>{{greeting}}</pre>'
    }
});
