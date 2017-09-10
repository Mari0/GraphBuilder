define(/**@lends TransformCoordinates*/ function () {
    /**
     * returns an object with x and y elements contain the coordinates of the translate(x,y)-function
     * @param {object} element - the element with a svg transform attribute
     * @constructor
     */
    function TransformCoordinates(element) {
        if(element instanceof jQuery) {
            element = element[0];
        }
        var coords = {};
        var xforms = element.getAttribute('transform');
        if (xforms != null) {
            var parts = /translate\(\s*([^\s,)]+)[ ,]([^\s,)]+)/.exec(xforms);
            coords['x'] = parseFloat(parts[1]);
            coords['y'] = parseFloat(parts[2]);
        } else {
            coords['x'] = 0;
            coords['y'] = 0;
        }
        return coords;
    }
    return TransformCoordinates;
});