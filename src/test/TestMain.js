requirejs.config({
    baseUrl:"js",
    paths: {
        chai : "./../components/chai/chai",
        jquery: "./../components/jquery/dist/jquery.min",
        JsonPath : "./../components/JSONPath/lib/jsonpath",
        test:"../test",
        sinon : "./../components/sinonjs/sinon"

    }
});
requirejs(['jquery','test/AppInitTest','test/JPathTest'],function(jquery, AppInitTest, JPathTest){

    $('#show_hide_tests').click(function(){

        var  $showTest = $('#showTest');
        if($showTest.is(':visible')) {
            $showTest.hide();
            $(this).text('Show Tests');
        }
        else{
            $showTest.show();
            $(this).text('Hide Tests');
        }
    });

    mocha.setup('bdd');
    mocha.reporter('html');
    mocha.timeout(5000);

    JPathTest();
    AppInitTest();

    mocha.run();
});