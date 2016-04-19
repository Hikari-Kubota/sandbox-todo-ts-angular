var app = angular.module('app', []);


app.directive('transcludeFn', function() {
    return {
        restrict: 'E',
        transclude: true,
        link: function(scope, iElement, iAttrs, controller, iTransclude) {
            var elem = iTransclude();
            iElement.append(elem);
        }
    }
});


/* スコープの明示的な指定 */
/*
app.directive('transcludeFn', function() {
    return {
        restrict: 'E',
        transclude: true,
        link: function(scope, iElement, iAttrs, controller, iTransclude) {
            var isolatedScope = scope.$new(true);
            var elem = iTransclude(isolatedScope, function(clonedElement, transcluededScope) {
                transcluededScope.newMessage = '新しいメッセージ';
            });
            iElement.append(elem);
        }
    }
});
*/
