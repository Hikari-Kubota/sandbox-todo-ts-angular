var app = angular.module('app', []);

app.controller('MyController', ['$scope', function($scope) {
    $scope.items = ['hoge', 'bar', 'fuga'];
}]);


/* compile 関数の指定 */
app.directive('myDirectiveCompile', function() {
    return {
        restrict: 'E',
        compile: function(tElement, tAttrs, tTransclude) {
            if (angular.isDefined(tAttrs.readonly)) {
                // readonly属性が定義されている場合はmessageをそのまま表示する
                tElement.append('{{message}}');
            } else {
                // readonly属性がない場合はinputタグとして表示する
                tElement.append('<input type="text" ng-model="message">');
            }
        }
    }
});


/* link 関数の指定 */
app.directive('myDirectivePostLink', function() {
    return {
        restrict: 'E',
        link: function(scope, iElement, iAttrs, controller, iTransclude) {
            scope.$watch('message', function(val) {
                iElement.text(val);
            })
        }
    };
});
