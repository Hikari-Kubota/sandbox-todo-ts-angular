app.constant('ConstMessage', 'This is my constant!');

app.constant('ConstValue', {
    value1: 12345,
    value2: 67890
});

app.constant('ConstFunc', function(a, b) {
    return a * b;
});
