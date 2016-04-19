var app = angular.module('app', []);

app.controller('NormalController', ['$scope', function($scope) {
    $scope.greeting = "Hello, World!";
    $scope.getGreeting = function() {
        console.log('update1');
        return $scope.greeting;
    };
    $scope.getHours = function() {
        console.log('update2');
        var hour = new Date().getHours();
        if (hour < 12) {
            $scope.greeting = 'おはよう！';
        } else if (hour < 18) {
            $scope.greeting = 'こんにちは！';
        } else {
            $scope.greeting = 'こんばんは！';
        }
        return hour;
    }
}]);

/*
app.controller('NormalController', ['$scope', function($scope) {
    $scope.message = "Hello, World!";
    $scope.getMessage = function() {
        console.log('getMessage');
        $scope.message = $scope.message + '!!';
        return $scope.message;
    };
}]);
*/
