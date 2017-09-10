define(['jquery'],function ($) {
    /**
     *
     * @param {string} id the identifier of the edge
     * @param {string} type the type
     * @param {string} name the label of the edge
     * @param {int} srcX x position of the starting point
     * @param {int} srcY y position of the starting point
     * @param {int} destX x position of the ending point
     * @param {int} destY y position of the ending point
     * @param {int} offsetX
     * @param {int} offsetY
     * @returns {jQuery}
     * @constructor
     */
    function SvgEdge(id,type, name, srcX, srcY, destX, destY, offsetX, offsetY){

        function SvgTextPath(pathId, label){
            var textPath = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');
            textPath.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#' + pathId);
            textPath.setAttribute('startOffset', '33.33%');
            textPath.textContent = label;
            return $(textPath);
        }
        var ctrl_x, ctrl_y;

        if(!offsetX && !offsetY) {
            ctrl_x = (srcX + destX) / 2;
            ctrl_y = (srcY + destY) / 2;
        }
        else{
            ctrl_x = offsetX;
            ctrl_y = offsetY;
        }
        return $(document.createElementNS("http://www.w3.org/2000/svg", 'g'))
            .attr('id', id)
            .attr('class', type)
            .append($(document.createElementNS("http://www.w3.org/2000/svg", 'path'))
                .attr('id', 'Path_'+id)
                .attr('d', 'M' + srcX + ',' + srcY + ' Q' + ctrl_x + ',' + ctrl_y + ' ' + destX + ',' + destY))
            .append($(document.createElementNS('http://www.w3.org/2000/svg', 'text'))
                .attr('font-family', 'Verdana')
                .attr('font-size', '15')
                .attr('fill', '#191970')
                .append(SvgTextPath('Path_'+id, name))
            )
            .hover(function (event) {
                $(event.target).parent().siblings('path').css({
                    'stroke-width' : 7
                });
            }, function (event) {
                $(event.target).parent().siblings('path').css({
                    'stroke-width' : 3
                });
            })
            .append($(document.createElementNS("http://www.w3.org/2000/svg", 'g'))
                .attr('class', 'Ctrl')
                .append($(document.createElementNS("http://www.w3.org/2000/svg", 'circle'))
                    .attr('cx', ctrl_x)
                    .attr('cy', ctrl_y)
                    .attr('r', 8)
                    .attr('class', 'controlPoint'))
                .append($(document.createElementNS("http://www.w3.org/2000/svg", 'line'))
                    .attr('x1', srcX)
                    .attr('y1', srcY)
                    .attr('x2', ctrl_x)
                    .attr('y2', ctrl_y)
                    .attr('class', 'SrcCtrlLine'))
                .append($(document.createElementNS("http://www.w3.org/2000/svg", 'line'))
                    .attr('x1', destX)
                    .attr('y1', destY)
                    .attr('x2', ctrl_x)
                    .attr('y2', ctrl_y)
                    .attr('class', 'DestCtrlLine')));
    }
    return SvgEdge;
});