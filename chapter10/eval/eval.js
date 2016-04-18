angular.module('app', []);

angular.module('app')
    .directive('evalDirective', function() {
        return {
            restrict: 'E',
            template: 'x: {{x}}, y:{{y}}',
            scope: {},
            link: function(scope) {
                scope.a = 10;
                scope.b = 23;
                // (1) 引数で渡した文字列を即時評価
                scope.x = scope.$eval('a + b');
                // (2) 引数で渡した文字列を$digestループ時に評価
                scope.$evalAsync('y = a + b');
            }
        }
    });


angular.module('app')
    .directive('parseDirective', ['$parse', function($parse) {
        return {
            restrict: 'E',
            template: 'x: {{x}}, y:{{y}}, literal: {{isLiteral}}, constant: {{isConstant}}',
            scope: {},
            link: function(scope) {
                scope.x = 123;
                // (1) scope.xを取得するための関数を生成
                var getter = $parse('x');
                scope.y = getter(scope);
                // (2) scope.xに値を設定するための関数を取得
                var setter = getter.assign;
                setter(scope, 456);
                // (3) $parseに渡した式がリテラルかどうか
                scope.isLiteral = getter.literal;
                // (4) $parseに渡した式が変更不可能かどうか
                scope.isConstant = getter.constant;
            }
        };
    }]);


angular.module('app')
    .directive('interpolateDirective', ['$interpolate', function($interpolate) {
        return {
            restrict: 'E',
            template: 'x: {{x}}',
            scope: {},
            link: function(scope) {
                scope.a = 1;
                scope.b = 2;
                // (1) 埋め込み式を含んだ文字列の解析をおこなう
                var exp = $interpolate('result = {{a + b}}');
                // (2) 解析結果を評価する
                scope.x = exp(scope);
            }
        };
    }]);


angular.module('app')
    .directive('compileDirective', ['$compile', function($compile) {
        return {
            restrict: 'E',
            scope: {},
            link: function(scope, element) {
                // (1) コンパイル対象の要素を準備
                var el = angular.element('<div ng-if="active">message: {{message}}</div>');
                // (2) compile関数を実行してlink関数を取得
                var linkFn = $compile(el);

                scope.active = true;
                scope.message = 'Hello, World!';

                // (3) link関数を実行して、実行結果の要素を取得
                var output = linkFn(scope);
                element.append(output);
            }
        };
    }]);
