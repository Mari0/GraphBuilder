define(function () {
    /**
     * Create a svg marker. the marker has the shape of an arrow and will be appended to each mapping rule or ontology edge
     * @returns {Object} marker - the DOM-Object which represents the svg-marker
     * @constructor
     */
   function SvgArrowMarker(){

       var marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
       marker.setAttribute('id', 'arrowMarker');
       marker.setAttribute('viewBox', '0 0 10 10');
       marker.setAttribute('refX', '0');
       marker.setAttribute('refY', '5');
       marker.setAttribute('markerUnits', "strokeWidth");
       marker.setAttribute('markerWidth', 3);
       marker.setAttribute('markerHeight', 3);
       marker.setAttribute('orient', 'auto');
       marker.setAttribute('fill', '#000000');

       var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
       path.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
       marker.appendChild(path);

       return marker;
   }
    return SvgArrowMarker;
});