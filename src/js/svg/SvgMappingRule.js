define(['jquery'],function ($) {
    /**
     *
     * @param id
     * @param type
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     * @returns {*|jQuery}
     * @constructor
     */
    function SvgMappingRule(id, type, x1, y1, x2, y2){
        return $(document.createElementNS("http://www.w3.org/2000/svg", 'g'))
            .attr('id', id)
            .attr('class', type)
            .append($(document.createElementNS("http://www.w3.org/2000/svg", 'line'))
                .attr('x1', x1)
                .attr('y1', y1)
                .attr('x2', x2)
                .attr('y2', y2));
    }

    return SvgMappingRule;
});