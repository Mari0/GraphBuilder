var page = require('webpage').create();

page.open('http://localhost:8888/', function(status) {

    console.log("Status: " + status);
    /*setTimeout(function() {
        page.render('graphbuilder.png');
        page.evaluate(function() {
            debugger;
            phantom.exit();
        });
    },3000);*/
});

page.onResourceRequested = function(request) {
    console.log('REQUEST: ' + request.url);
};
page.onResourceReceived = function(response) {
    console.log('RECEIVE: ' + response.url + ' Status: ' + response.status);
};
page.onConsoleMessage = function(response){

    console.log('CONSOLE: ' + response);
    if(response === 'GraphBuilder finished') {
        page.render('scrreenshot1.png');
        page.evaluate(function() {
            debugger;
            console.log('in evaluate');

        });
        phantom.exit();

    }
};