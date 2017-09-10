define(function () {

    function FooterContent(){
        var htmlOk = '<button type="button" class="btn btn-success"><span class="glyphicon glyphicon-ok"></span></button>';
        var htmlRemove = '<button type="button" class="btn btn-danger"><span class="glyphicon glyphicon-remove"></span></button>';

        var btnClose = {
            item: htmlRemove,
            event: 'click',
            btnclass: 'btn-sm',
            btntext: ' Close',
            callback: function (event) {event.data.close(); }
        };
        var  btnOk =  {
            item: htmlOk,
            event: 'click',
            btnclass: 'btn-sm',
            btntext: ' Ok',
            callback: null
        };

        this.registerOkButtonCallback = function(fnc){
            btnOk.callback = fnc;
        };

        this.getContent = function(){
            if(!btnOk.callback) {
                btnOk.callback = function (event) {
                    event.data.close();
                };
            }
            return [btnClose,btnOk];
        }
    }


    return FooterContent;
});