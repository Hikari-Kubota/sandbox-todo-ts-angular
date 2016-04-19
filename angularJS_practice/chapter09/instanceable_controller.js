app.controller('TaxController', ['$scope', 'TaxCalculatorFactory',
    function($scope, TaxCalculatorFactory) {
        var taxCalculator5 = TaxCalculatorFactory(0.05);
        var taxCalculator8 = TaxCalculatorFactory(0.08);
        var taxCalculator10 = TaxCalculatorFactory(0.10);

        $scope.calculate5 = function(price) {
            return taxCalculator5.calculate(price);
        }

        $scope.calculate8 = function(price) {
            return taxCalculator8.calculate(price);
        }

        $scope.calculate10 = function(price) {
            return taxCalculator10.calculate(price);
        }

    }
]);
