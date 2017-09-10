define([
    'jquery',
    'lodash',
    'bootstrapWrapper/Alert',
    'MappingManager',
    'text!tpl/navbar/httpInputTab.html',
    'text!tpl/navbar/radioButton.html',
    'text!tpl/navbar/htmlGETForm.html',
    'text!tpl/navbar/htmlPOSTForm.html'], /**@lends HttpInputTab*/
	function ($, _, Alert, MappingManager, htmlHttpInputTab, tplRadioButton, htmlGETForm, htmlPOSTForm) {
	
	function HttpInputTab() {

        var tpl = _.template(tplRadioButton);

        function RadioButton(label, appendToSelector, callback, active) {
            $(appendToSelector).append($(tpl({name: label, active: active ? 'active' : ''}))
                .click(function () {
                    if (callback) {
                        callback();
                    }
                }));
        }
        function httpGetInputForm() {
            var $htmlGetForm = $(htmlGETForm);
            $htmlGetForm.find('button')
                .click(function () {
                    var url = $('#httpGetInputForm_getUrl').val();
                    var successCallback = function (resp) {
                        var data;
                        try {
                            data = JSON.parse(resp);
                        } catch (e) {
                            data = resp;
                        }
                        $('#panel_MappingConfigurator').remove();
                        MappingManager.createMappingCanvasFromExample('HTTP GET Input', data);
                        Alert.Success('Get Request was sucessful', '#httpGetForm');
                    };
                    var errorCallback = function () {
                        Alert.Error('Error! Invalid request. ', '#httpGetForm');
                    };
                    var JSONP_request = {
                        type: 'GET',
                        url: url,
                        dataType: "jsonp",
                        jsonpCallback: 'callback',
                        headers: {
                            // 'Access-Control-Allow-Origin': '*'
                        },
                        xhrFields: {
                            withCredentials: false
                        },
                        success: function (resp) {
                            successCallback(resp);
                        },
                        error: function (resp) {
                            errorCallback(resp);
                        }

                    };
                    var request = {
                        type: 'GET',
                        url: url,
                        contentType: 'application/json',
                        headers: {
                            // 'Access-Control-Allow-Origin': '*'
                        },
                        xhrFields: {
                            withCredentials: false
                        },
                        success: function (resp) {
                            successCallback(resp);
                        },
                        error: function (resp) {
                            errorCallback(resp);
                        }

                    };
                    if ($('#httpGetForm').find('.checkbox input').prop('checked')) {
                        $.ajax(JSONP_request);
                    }
                    else {
                        $.ajax(request);
                    }
                });
            return $htmlGetForm;
        }
        function httpPostInputForm() {
            var $htmlPOSTForm = $(htmlPOSTForm);
            $(htmlPOSTForm).find('button')
                .click(function () {
                    var url = $('#httpPostInputForm_getUrl').val();
                    var data = $('#httpPostInputForm_getData').val();
                    $.post(url, data, function (data) {
                        $('#panel_MappingConfigurator').remove();
                        MappingManager.createMappingCanvasFromExample('HTTP POST Input', data);
                        Alert.Success('Get Request was sucessful', '#httpPostForm');
                    }).fail(function (error) {
                        var e = JSON.parse(error.responseText);
                        Alert.Error(e.code + ' ! ' + e.errorMessage, '#httpPostForm');
                    });
                });
            return $htmlPOSTForm;
        }


        $('#mc_navbar_content').append($(htmlHttpInputTab));

        RadioButton('GET', '#httpInputRadioButtons', function () {
            var $httpGetForm = $('#httpGetForm');
            if ($httpGetForm.length === 0) {
                $('#httpInputCtrl').find('.panel-body').append(httpGetInputForm());
            }
            $httpGetForm.show();
            $('#httpPostForm').hide();
        }, true);
        RadioButton('POST', '#httpInputRadioButtons', function () {
            var $httpPostForm = $('#httpPostForm');
            if ($httpPostForm.length === 0) {
                $('#httpInputCtrl').find('.panel-body').append(httpPostInputForm());
            }
            $httpPostForm.show();
            $('#httpGetForm').hide();
        });


    }
	return HttpInputTab;
});
