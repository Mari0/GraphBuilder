define(['jquery',
    'Global',
    'MappingManager',
    'entities/range/EdgeClass',
    'events/AbortEvent',
    'events/DragNDropEvent',
    'util/GUIDGenerator'],
    /**@lends EdgeClassEvent*/ function ($, Global, MappingManager, EdgeClass, AbortEvent, DragNDropEvent, Guid) {

        /** replaces the global left-click event. this function allows the selection of the source and destiniations of the a edge class
         * @param evt {event} - the javascript event. this parameter is passed by the global addEdge()-function
         * */
        function SelectVertexSrcAndDest(evt) {
            var $targetElement = $(evt.target);
            var Id = $targetElement.parents('.NodeClass').attr('id');
            if (Id && EdgeClassEvent.sourceId === undefined) {
                EdgeClassEvent.sourceId = Id;
            } else if (Id && EdgeClassEvent.targetId === undefined) {
                EdgeClassEvent.targetId = Id;
            }

            if (EdgeClassEvent.sourceId != null && EdgeClassEvent.targetId  != null) {
                var canvas = MappingManager.getMappingCanvasById(Global.CurrentTabId);
                var srcNode = canvas.getNodeClassById(EdgeClassEvent.sourceId);
                var targetNode = canvas.getNodeClassById(EdgeClassEvent.targetId);
                var edgeId = Guid();
                if(srcNode && targetNode){
                    var dataProperties = null;
                    if (Global.Ontology.edge_classes.hasOwnProperty(EdgeClassEvent.className)) {
                        if(Global.Ontology.edge_classes[EdgeClassEvent.className].hasOwnProperty('properties')) {
                            dataProperties = Global.Ontology.edge_classes[EdgeClassEvent.className].properties;
                        }
                    } else {
                        dataProperties = null;
                    }

                    var edge = new EdgeClass(edgeId, EdgeClassEvent.className, srcNode, targetNode);
                    canvas.addEdgeClass(edge);
                }
                $(Global.CurrentTabId).find('svg').css({
                    'cursor' : 'default'
                });
                $(Global.CurrentTabId).find('svg').unbind('mousedown');
                $(Global.CurrentTabId).find('svg')
                    .mousedown(function (event) {
                        DragNDropEvent.DefaultMouseDownEvent(event);
                    });
                Global.InEdgeCreationMode = false;
                EdgeClassEvent.sourceId = undefined;
                EdgeClassEvent.targetId = undefined;
            }
        }

        function EdgeClassEvent(){}

        EdgeClassEvent.sourceId = undefined;
        EdgeClassEvent.targetId = undefined;


        EdgeClassEvent.EdgeCreateEvent = function(className){


            if(!className) {
                return;
            }
            EdgeClassEvent.className = className;
            if (!Global.Ontology) {
                console.log('No Ontology loaded!');
            }
            $(Global.CurrentTabId).find('svg').css({
                'cursor' : 'crosshair'
            });
            Global.InEdgeCreationMode = true;
            $(Global.CurrentTabId).find('svg').unbind('mousedown');
            $(Global.CurrentTabId).find('svg').mousedown(function (event) {
                switch (event.which) {
                    case 3:
                        AbortEvent();
                        break;
                    case 1:
                        SelectVertexSrcAndDest(event);
                        break;
                }

            });
        };

        return EdgeClassEvent;


});
