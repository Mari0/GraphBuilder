
define([
    'jquery',
    'Global'
    ], /**@lends SvgEntity*/ function ($, Global) {

    /**
     * Generates a svg-group which consist of a rectangle and a text. the group is used to represent elements
     * of the json-schema-visualization and the attributes of vertex classes in the MappingConfigurator.
     * @param text {string} - the label for the rectangle
     * @param x {int} - the x-position in the svg
     * @param y {int} - the y-position in the svg
     * @param width {int} - the width of the rectangle
     * @param height {int} - the height of the rectangle
     * @param entityClass {string} - the class for the group .
     * @param entityId {string} - the id for the group
     * @param color {string} - the color
     * @return returns the DOM-object which represents the g-tag
     */
    function SvgEntity(entityId, entityClass, text, x, y, width, height, color){

        var cssOnMouseOver ={
            'stroke': 'blue',
            'stroke-width': 5
        };

        var ccsOnMouseOut = {
            'stroke': 'black',
            'stroke-width': 1
        };

        var $node = $(document.createElementNS("http://www.w3.org/2000/svg", "g"))
            .attr('class', entityClass)
            .attr('id', entityId)
            .on('mouseover', function (event) {
                if(Global.InEdgeCreationMode) {
                    event.target.setAttribute('cursor', 'crosshair');
                }
                else{
                    event.target.setAttribute('cursor', 'pointer');
                }

                var $target = $(event.target);
                if ($target.is('rect')) {
                    $target.css(cssOnMouseOver);
                }
                else if($target.is('g')){
                    $target.find('rect').css(cssOnMouseOver);
                }
                else{
                    $target.siblings('rect').css(cssOnMouseOver);
                }
            })
            .on('mouseout', function (event) {
                event.target.setAttribute('cursor', 'default');
                var $target = $(event.target);
                if ($target.is('rect')) {
                    $target.css(ccsOnMouseOut);
                }
                else if($target.is('g')){
                    $target.find('rect').css(ccsOnMouseOut);
                }
                else{
                    $target.siblings('rect').css(ccsOnMouseOut);
                }
            })
            .append($(document.createElementNS("http://www.w3.org/2000/svg", "rect"))
                .attr('x', x)
                .attr('y', y)
                .attr('rx', 5)
                .attr('ry', 5)
                .attr('width', width)
                .attr('height', height)
                .css('fill', color))
            .append($(document.createElementNS("http://www.w3.org/2000/svg", "text"))
                .attr('x', (2 * x + width) / 2)
                .attr('y', (2 * y + height) / 2)
                .text(text)
                /*.hover(function(event){
                    $(event.target).siblings('rect').css({
                        'stroke' : 'blue',
                        'stroke-width' : 5
                    });
                },function(event){
                    $(event.target).siblings('rect').css({
                       'stroke' : 'black',
                        'stroke-width' : 1
                    });
                })*/);

        if(entityClass === 'NodeClass' || entityClass === 'ClassProperty') {
            var GEAR_ICON = Global.Config.ICONS.GEAR;
            var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
            use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#gearIcon');
            $(use)
                .attr('class', 'icon-gear')
                .attr('transform', 'translate(' + (((2 * x + width) / 2) + GEAR_ICON.OFFSET_X) + ',' + (((2 * y + height) / 2) + GEAR_ICON.OFFSET_Y) + ') scale('+ GEAR_ICON.SCALE +')');
            $node.append(use);
        }


        if(entityClass === 'JsonArray' || entityClass === 'JsonObject' || entityClass === 'NodeClass' || entityClass === 'EdgeClass') {
            $node.append($(document.createElementNS("http://www.w3.org/2000/svg", "g"))
                .attr('class', 'properties'));
        }
        return $node;
    }
    return SvgEntity;
});