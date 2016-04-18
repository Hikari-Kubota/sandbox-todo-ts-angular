app.controller('ServiceController', ['$scope', 'serviceService',
    function($scope, serviceService) {
        $scope.message = serviceService.message;
        $scope.value = serviceService.value;
        $scope.func = serviceService.add;
    }
]);
