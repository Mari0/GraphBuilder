define(['jquery', 'Global', 'util/TransformCoordinates'], /**@lends DragNDrop*/
	function ($, Global, GetTransformCoords) {
    function DragNDrop() {}
    /**@global */
    /** the svg root object */
    DragNDrop.SVGRoot = null;

	/** @global */
	/** the true coordinates of the dragged target*/
	DragNDrop.TrueCoords = null;

	/** @global */
	/** the point where the element got grabbed*/
	DragNDrop.GrabPoint = null;

	/** @global */
	/** the target element to be dragged */
	DragNDrop.DragTarget = null;

    DragNDrop.Entity = null;

	/**
	 * this function initializes the Grabpoint, DragTarget, the TrueCoords and the pathes, src_edges and dest_edges to drag them with the vertex class
	 * @param evt - the event who triggerd the Grab-function. used to get access to the vertex class the users wants to drag
	 */
	DragNDrop.Grab = function (evt) {
		DragNDrop.SVGRoot = $(Global.CurrentTabId).find('svg')[0];
		//Enable or disable dragging of objects in SVGMappingConfigurator.onMouseDown
		// find out which element we moused down on
		var $targetElement = $(evt.target).parent('g');
		var draggable = false;
        var MappingManager = require('MappingManager');
        var canvas = MappingManager.getCurrentMappingCanvas();

        if ($targetElement.is('.NodeClass')) {
            DragNDrop.Entity = canvas.getNodeClassById($targetElement.attr('id'));

			//set the item moused down on as the element to be dragged
			DragNDrop.DragTarget = $targetElement;

			draggable = true;
		} else if ($targetElement.is('.Ctrl')) {
            DragNDrop.DragTarget = $targetElement.children('.controlPoint');
            DragNDrop.Entity = canvas.getEdgeClassById(DragNDrop.DragTarget.parents('.EdgeClass').attr('id'));
            draggable = true;
    }


		if (draggable) {
			// move this element to the "top" of the display, so it is (almost)
			//    always over other elements (exception: in this case, elements that are
			//    "in the folder" (children of the folder group) with only maintain
			//    hierarchy within that group
			DragNDrop.DragTarget.parent().append(DragNDrop.DragTarget);

			// turn off all pointer events to the dragged element, this does 2 things:
			//    1) allows us to drag text elements without selecting the text
			//    2) allows us to find out where the dragged element is dropped (see Drop)
			DragNDrop.DragTarget.attr('pointer-events', 'none');

			// we need to find the current position and translation of the grabbed element,
			//    so that we only apply the differential between the current location
			//    and the new location
			var transMatrix = DragNDrop.DragTarget[0].getCTM();
			DragNDrop.GrabPoint.x = DragNDrop.TrueCoords.x - Number(transMatrix.e);
			DragNDrop.GrabPoint.y = DragNDrop.TrueCoords.y - Number(transMatrix.f);
		}
	};

	/**
	 * the Drag- function updates the vertex class and all components which are connected with the vertex class
	 * @param evt - the event is used to get the real coordinations
	 */
	DragNDrop.Drag = function (evt) {
		// account for zooming and panning
		DragNDrop.GetTrueCoords(evt);

		// if we don't currently have an element in tow, don't do anything
		if (DragNDrop.DragTarget) {
			//change cursor during dragging
			$(evt.target).css('cursor', 'move');

			/* account for the offset between the element's origin and the
			* exact place we grabbed it... this way, the drag will look more natural */
			var newX = DragNDrop.TrueCoords.x - DragNDrop.GrabPoint.x;
			var newY = DragNDrop.TrueCoords.y - DragNDrop.GrabPoint.y;

            /* apply a new transform translation to the dragged element, to display it in its new location*/
            DragNDrop.DragTarget.attr('transform', 'translate(' + newX + ',' + newY + ')');

            if (DragNDrop.DragTarget.is('.NodeClass') && DragNDrop.Entity != null) {
                DragNDrop.Entity.OFFSETX = newX;
                DragNDrop.Entity.OFFSETY = newY;

                var mappingRules = DragNDrop.Entity.getAllMappingRules();
                for(var key3 in mappingRules){
                    if(mappingRules.hasOwnProperty(key3)){
                        DragNDrop.DragMappingRule(mappingRules[key3]);
                    }
                }

                var outgoingEdges = DragNDrop.Entity.getOutgoingEdges();
                for(var key in outgoingEdges){
                    if(outgoingEdges.hasOwnProperty(key)){
                        DragNDrop.UpdateEdge(outgoingEdges[key].get$node(), 'src');
                    }
                }

                var ingoingEdges = DragNDrop.Entity.getIngoingEdges();
                for(var key2 in ingoingEdges){
                    if(ingoingEdges.hasOwnProperty(key2)){
                        DragNDrop.UpdateEdge(ingoingEdges[key2].get$node(), 'dest');
                    }
                }
            }
            else if (DragNDrop.DragTarget.is('.controlPoint')) {
                DragNDrop.DragControlPoint(DragNDrop.DragTarget);
            }
        }
    };

    /** @global */
    /**
	 * the Drop function resets all global variables  realted and completes the Drag&Drop-process
	 * the global variables related to the Drag&Drop-proccess
	 * DragTarget, pathes, src_edges, dest_edges
	 */
	DragNDrop.Drop = function () {
		// if we aren't currently dragging an element, don't do anything
		if (DragNDrop.DragTarget) {
			// since the element currently being dragged has its pointer-events turned off,
			//    we are afforded the opportunity to find out the element it's being dropped on

			//var targetElement = evt.target;

			// turn the pointer-events back on, so we can grab this item later
			DragNDrop.DragTarget.attr('pointer-events', 'all');
			// set the global variable to null, so nothing will be dragged until we
			//    grab the next element
			DragNDrop.DragTarget = null;
			DragNDrop.Entity = null;
			//reset cursor to default after drag&drop
			$(Global.CurrentTabId).find('svg').css({
				'cursor' : 'default'
			});
		}

	};

	/**
	 * Updates the TrueCoords-variable
	 * @param evt - the event to update the coordinates
	 * @see TrueCoords
	 */
	DragNDrop.GetTrueCoords = function (evt) {
		// find the current zoom level and pan setting, and adjust the reported
		//    mouse position accordingly
		var newScale = DragNDrop.SVGRoot.currentScale;
		var translation = DragNDrop.SVGRoot.currentTranslate;
		DragNDrop.TrueCoords.x = (evt.clientX - translation.x) / newScale;
		DragNDrop.TrueCoords.y = (evt.clientY - translation.y) / newScale;

	};
	/**
	 * this method recalculates the shape of the edge path
	 * @method
	 * @param {object} ctrlPoint - the control point which is currently selected for dragging
	 */
	DragNDrop.DragControlPoint = function (ctrlPoint) {
		var transform = GetTransformCoords(ctrlPoint);
		var newX2 = parseInt(ctrlPoint.attr('cx')) + transform.x;
		var newY2 = parseInt(ctrlPoint.attr('cy')) + transform.y;

		var line1 = $(ctrlPoint).siblings('.SrcCtrlLine');
        line1.attr('x2', newX2);
        line1.attr('y2', newY2);

		var line2 = $(ctrlPoint).siblings('.DestCtrlLine');
        line2.attr('x2', newX2);
        line2.attr('y2', newY2);

        DragNDrop.Entity.OFFSETX = newX2;
        DragNDrop.Entity.OFFSETY = newY2;

		var d = $(ctrlPoint).parent().siblings('path').attr('d').split(' ');
		d[1] = 'Q' + newX2 + ',' + newY2;
		$(ctrlPoint).parent().siblings('path').attr('d', d[0] + ' ' + d[1] + ' ' + d[2]);
	};

	/**
	 * this function updates a edge if it is connected to a vertex class-object
	 * @method
	 * @param {Object} edge - the edge to update
	 * @param {boolean} isSrc - determines which end of the edge to update
	 */
	DragNDrop.UpdateEdge = function (edge, isSrc) {
        var translateCoords,
            rect,
            line,
            newX,
            refLine,
            dist1,
            dist2,
            newY,
            d,
            parts;
        if (isSrc === 'src') {
            translateCoords = GetTransformCoords(DragNDrop.DragTarget);
            rect = DragNDrop.DragTarget.find('rect')[0];
            line = edge.find('.SrcCtrlLine')[0];
            newX = rect.x.baseVal.value + translateCoords.x;
            refLine = edge.find('.DestCtrlLine')[0];
            dist1 = (refLine.x1.baseVal.value - newX) < 0 ? (refLine.x1.baseVal.value - newX) * (-1) : (refLine.x1.baseVal.value - newX);
            dist2 = (refLine.x1.baseVal.value - (newX + rect.width.baseVal.value)) < 0 ? (refLine.x1.baseVal.value - (newX + rect.width.baseVal.value)) * (-1) : (refLine.x1.baseVal.value - (newX + rect.width.baseVal.value));
            if (dist1 > dist2) {
                newX += rect.width.baseVal.value;
            }
            newY = rect.y.baseVal.value + (rect.height.baseVal.value / 2) + translateCoords.y;
            line.x1.baseVal.value = newX;
            line.y1.baseVal.value = newY;
            d = $(edge).children('path').attr('d');
            parts = d.split(' ');
            parts[0] = 'M' + newX + ',' + newY;
            $(edge).children('path').attr('d', parts[0] + ' ' + parts[1] + ' ' + parts[2]);
        } else {
            translateCoords = GetTransformCoords(DragNDrop.DragTarget);
            rect = DragNDrop.DragTarget.find('rect')[0];
            newX = rect.x.baseVal.value + translateCoords.x - 12;
            line = edge.find('.DestCtrlLine')[0];
            refLine = edge.find('.SrcCtrlLine')[0];
            dist1 = (refLine.x1.baseVal.value - newX) < 0 ? (refLine.x1.baseVal.value - newX) * (-1) : (refLine.x1.baseVal.value - newX);
            dist2 = (refLine.x1.baseVal.value - (newX + rect.width.baseVal.value)) < 0 ? (refLine.x1.baseVal.value - (newX + rect.width.baseVal.value)) * (-1) : (refLine.x1.baseVal.value - (newX + rect.width.baseVal.value));
            if (dist1 > dist2) {
                newX += rect.width.baseVal.value + 24;
            }
            newY = rect.y.baseVal.value + (rect.height.baseVal.value / 2) + translateCoords.y;
            line.x1.baseVal.value = newX;
            line.y1.baseVal.value = newY;

            d = $(edge).children('path').attr('d');

            parts = d.split(' ');
            parts[2] = newX + ',' + newY;

            d = $(edge).children('path').attr('d', parts[0] + ' ' + parts[1] + ' ' + parts[2]);
        }
	};



	/**
	 * updates the position of the destination point of the svg-line during dragging
	 * @method
	 * @param {Object} path - the mapping rule to updateCommands
	 */
	DragNDrop.DragMappingRule = function (path) {
		var translateCoords = GetTransformCoords(DragNDrop.DragTarget);
        var $svg = path.get$node().children('line');
        var classProperty = path.getRange();
        $svg.attr('x2', classProperty.X + translateCoords.x - 13);
        $svg.attr('y2', classProperty.Y + translateCoords.y + (classProperty.getHeight() / 2));

	};
	return DragNDrop;
});
