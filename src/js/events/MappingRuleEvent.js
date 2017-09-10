define(['jquery',
    'Global',
    'MappingManager',
    'entities/MappingRule',
    'events/AbortEvent',
    'events/DragNDropEvent',
    'util/GUIDGenerator'], function($, Global, MappingManager, MappingRule, AbortEvent, DragNDropEvent, Guid){

    /** replace of the global left-click event. allow the selection of the source and the destination of a mapping rule
     * @param evt {event} - the javascript event. this parameter is passed by the global addTranslationRule()-function*/
    function SelectSrcAndDest(evt) {
        var $targetElement = $(evt.target);
        if ($targetElement.parent().is('.JsonProperty') &&  MappingRuleEvent.domainId === undefined) {
            MappingRuleEvent.domainId = $targetElement.parent().attr('id');
        }
        else if ($targetElement.parent().is('.ClassProperty') && MappingRuleEvent.rangeId === undefined) {
            MappingRuleEvent.rangeId = $targetElement.parent().attr('id');
        }


        if (MappingRuleEvent.domainId != null && MappingRuleEvent.rangeId != null) {
            var canvas = MappingManager.getMappingCanvasById(Global.CurrentTabId);

            var domainEntity =  canvas.getDomainEntityById(MappingRuleEvent.domainId);
            var rangeEntity = canvas.getClassPropertyById(MappingRuleEvent.rangeId);

            var rule = new MappingRule(Guid(), domainEntity, rangeEntity);
            canvas.addMappingRule(rule);

            Global.InMappingRuleCreationMode = false;
            $(Global.CurrentTabId).find('svg').css({
                'cursor' : 'default'
            });

            $(Global.CurrentTabId).find('svg').unbind('mousedown');
            $(Global.CurrentTabId).find('svg')
                .mousedown(function (event) {
                    DragNDropEvent.DefaultMouseDownEvent(event);
                });

            $('.ClassProperty').on('click');
            Global.InEdgeCreationMode = false;
            MappingRuleEvent.domainId = undefined;
            MappingRuleEvent.rangeId = undefined;
        }
    }
    function MappingRuleEvent(){}

    MappingRuleEvent.domainId = undefined;
    MappingRuleEvent.rangeId = undefined;

    MappingRuleEvent.MappingRuleCreateEvent = function(){

        $(Global.CurrentTabId).find('svg').css({
            'cursor' : 'crosshair'
        });
        Global.InEdgeCreationMode = true;

        $(Global.CurrentTabId).find('svg').unbind('mousedown');
        $(Global.CurrentTabId).find('svg').mousedown(function (event) {
            switch (event.which) {
                case 3:
                    Global.InEdgeCreationMode = false;
                    AbortEvent();
                    break;
                case 1:
                    SelectSrcAndDest(event);
                    break;
            }
        });
    };

    return MappingRuleEvent;


});
