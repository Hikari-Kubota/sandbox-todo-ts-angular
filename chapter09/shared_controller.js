/* Controller A */
app.controller('ControllerA', ['$scope', 'SharedService',
    function($scope, SharedService) {
        $scope.setValue = function(value) {
            SharedService.setValue('key', value);
        }
    }
]);

/* Controller B */
app.controller('ControllerB', ['$scope', 'SharedService',
    function($scope, SharedService) {
        $scope.getValue = function() {
            return SharedService.getValue('key');
        }
    }
]);
