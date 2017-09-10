define([
    'jquery',
    'Global',
    'events/DragNDropEvent'], function ($, Global, DragNDropEvent) {
    return function() {
        $(Global.CurrentTabId).find('svg').css({
            'cursor': 'default'
        });
        $(Global.CurrentTabId).find('svg').unbind('mousedown');
        $(Global.CurrentTabId).find('svg').mousedown(function (event) {
            DragNDropEvent.DefaultMouseDownEvent(event);
        });
        Global.InMappingRuleCreationMode = false;
    }

});