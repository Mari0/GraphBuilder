define(['jquery','chai','test/LoadDataTest'],function ($,chai, LoadDataTest) {
    return function(){
        var expect =  chai.expect;
        describe('GUI', function () {
            //initialize the app and wait a little
            //TODO find a better way for this
            /*before(function (done) {

                require(['config'], function () {
                    setTimeout(function () {
                        done();
                    }, 2500);
                });
            });*/

            context('Check Tabs', function () {
                it('should have a File-Tab', function () {
                    var id = $('#mc_navbar_content').find('#inputCtrl').attr('id');
                    expect(id).to.equal('inputCtrl');
                });
                it('should have a Project-Tab', function () {
                    var id = $('#mc_navbar_content').find('#ProjectCtrl').attr('id');
                    expect(id).to.equal('ProjectCtrl');
                });


            });
            LoadDataTest();
        });
    }
});