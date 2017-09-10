define([
    'jquery',
    'Global'
], function($, Global) {
    return function() {
        $(Global.CurrentTabId).find('svg').css({
            'cursor': 'default'
        });
        $(Global.CurrentTabId).find('svg').unbind('mousedown');
        Global.InMappingRuleCreationMode = false;
    };

});