app.value('MyMessage', 'This is my value.');

app.value('MyValue', {
    value1: 12345,
    value2: 12345
});

app.value('MyFunc', function(a, b) {
    return a + b;
});
