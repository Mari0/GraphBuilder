define([
    'jquery',
    'lodash',
    'text!tpl/alertTemplate.html'
], /**@lends Alert*/
    function($, _, htmlAlertTemplate) {
        /**
         * @constructor
         * provides static methods to provide a easy use of the twitter bootstrap alerts
         */
        function Alert() {}

        var tpl = _.template(htmlAlertTemplate);

        /**
         * a simple template for a twitter bootstrap alert 
         * @param type {string} - twitter bootstrap alert type can be 'info', 'success','danger' and 'warning'
         * @param message {string} - the content of the alert
         * @return the alert as jquery-object
         */
        var AlertTemplate = function(type, message) {
            return $(tpl({
                type: type,
                message: message
            }));
        };

        /**
         * A simple error alert using Twitter Bootstrap
         * @param message{string} - the error message
         * @param appendTo {string} - the jquery selector which identifies the tag to append the alert
         */
        Alert.Error = function(message, appendTo) {
            $(appendTo).append(AlertTemplate('danger', message));
        };

        Alert.Error2 = function(message, appendTo, callback) {
            var $message = AlertTemplate('danger', message);
            var extras = $(document.createElement('p'))
                .append($(document.createElement('button')).attr('class', 'btn btn-danger').attr('type', 'button').text('Do it!')
                    .click(function() {
                        if (callback) {
                            callback();
                        }
                    }))
                .append($(document.createElement('button')).attr('class', 'btn btn-default').attr('type', 'button').text('Cancel')
                    .click(function() {
                        $('.alert-danger').remove();
                    }));
            $(appendTo).append($($message).append(extras));
        };

        /**
         * A simple info alert using Twitter Bootstrap
         * @param message{string} - the content of the alert
         * @param appendTo {string} - the jquery selector which identifies the tag to append the alert
         */
        Alert.Info = function(message, appendTo) {
            $(appendTo).append(AlertTemplate('info', message));
        };

        /**
         * A simple warning alert using Twitter Bootstrap
         * @param message{string} - the content of the alert
         * @param appendTo {string} - the jquery selector which identifies the tag to append the alert
         */
        Alert.Warning = function(message, appendTo) {
            $(appendTo).append(AlertTemplate('warning', message));
        };

        /**
         * A simple success alert using Twitter Bootstrap
         * @param message{string} - the content of the alert
         * @param appendTo {string} - the jquery selector which identifies the tag to append the alert
         */
        Alert.Success = function(message, appendTo) {
            $(appendTo).append(AlertTemplate('success', message));
            setTimeout(function() {
                $('.alert-success').remove();
            }, 1000);
        };
        return Alert;
    });