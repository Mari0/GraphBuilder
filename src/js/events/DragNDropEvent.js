define(['jquery',
    'Global',
    'util/DragAndDrop',
    'panels/NodeClassPanel'],
    /**@lends DragNDropEvent*/ function ($, Global, DragNDrop, NodeClassPanel) {
        /**
         * Prevents text selection during drag and drop.
         * called in mousedown- and mousemove-event of SVG-Object
         */
        function pauseEvent(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.cancelBubble = true;
            e.returnValue = false;
            return false;
        }

        function DragNDropEvent(){}

        DragNDropEvent.DefaultMouseDownEvent = function(event){
            pauseEvent(event);
            var $targetElement = $(event.target).parent();
            switch (event.which) {
                case 1: { //left click
                    if($(event.target).is('.icon-gear') && $targetElement.is('.NodeClass')){
                        var mappingCanvas = require('MappingManager').getMappingCanvasById(Global.CurrentTabId);
                        var nodeClass = mappingCanvas.getNodeClassById($targetElement.attr('id'));
                        if(nodeClass) {
                            NodeClassPanel(nodeClass);
                        }
                        return;
                    }
                    else if ($targetElement.is('.NodeClass')) {
                        DragNDrop.Grab(event);
                    }
                    else if ($(event.target).is('.controlPoint')) {
                        DragNDrop.Grab(event);
                    }
                    //prevent text selection
                    pauseEvent(event);
                    break;
                }
            }
        };

        DragNDropEvent.DefaultMouseMoveEvent = function(event){
            pauseEvent(event);
            DragNDrop.Drag(event);
        };

        DragNDropEvent.DefaultMouseUpEvent = function(event){
            pauseEvent(event);
            switch (event.which) {
                case 1:{
                    DragNDrop.Drop(event);
                    break;
                }
            }
        };

        return DragNDropEvent;
    });