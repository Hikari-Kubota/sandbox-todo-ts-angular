app.controller('storageController', ['$scope', 'webStorage', function($scope, webStorage) {

    function updateItems() {
        $scope.items = [];
        angular.forEach(webStorage.keys(), function(key) {
            var storage = webStorage(key);
            $scope.items.push({
                name: key,
                storage: storage
            });
        });
    }

    updateItems();

    $scope.addItem = function(key, value) {
        var storage = webStorage(key);
        storage.set(value);
        updateItems();
    };

    $scope.clear = function() {
        webStorage.clear();
        updateItems();
    };

    webStorage.on(function(event) {
        updateItems();
    })
}]);
