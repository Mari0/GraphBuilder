define(['jquery',
    'svg/SvgArrowMarker',
    'events/DragNDropEvent',
    'svg/SvgGearIcon',
    'svg/SvgKeyIcon'],function ($, SvgArrowMarker,DragNDropEvent, SvgGearIcon, SvgKeyIcon) {

    /**
     *
     * @param id
     * @param width
     * @param height
     * @returns {*|jQuery}
     * @constructor
     */
    function SvgCanvas(id, width, height){
        return $(document.createElementNS('http://www.w3.org/2000/svg', 'svg'))
            .attr('id', id)
            .attr('class', 'mapping context-menu-one')
            .attr('width', width)
            .attr('height', height)
            .attr('version', '1.1')
            .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
            .attr('xmlns', 'http://www.w3.org/2000/svg')
            .append($(document.createElementNS('http://www.w3.org/2000/svg', 'defs'))
                .append(SvgArrowMarker())
                .append(SvgGearIcon())
                .append(SvgKeyIcon())
            )
            .mousedown(function(event){
                DragNDropEvent.DefaultMouseDownEvent(event);
            }).mousemove(function(event){
                DragNDropEvent.DefaultMouseMoveEvent(event);
            }).mouseup(function(event){
                DragNDropEvent.DefaultMouseUpEvent(event);
            });
    }
    return SvgCanvas;
});