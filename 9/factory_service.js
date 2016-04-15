app
    .factory('factoryService', function(){
        var aService = {};
        aService.message = 'This is my factory!';
        aService.value = {
            value1: 98765,
            value2: 43210
        }
        aService.add = function(a, b){
            return a + b;
        }
        return aService;
    });
