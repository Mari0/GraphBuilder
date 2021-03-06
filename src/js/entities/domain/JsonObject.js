define([
    'entities/domain/JsonAbstractCollection'
    ],/**@lends JsonObject*/
    function(JsonAbstractCollection){

    JsonObject.prototype = new JsonAbstractCollection();
    JsonObject.prototype.constructor = JsonObject;

    JsonObject.TYPE = 'JsonObject';
    JsonObject.COLOR = "#1C86EE";

    /**
     * A JsonObject of the Domain
     * @param {string} id the identifier of the json object
     * @param {string} name the name of the key the object is assigned to
     * @param {int} x the x-position in the svg canvas
     * @param {init} y the y-position in the svg canvas
     * @param {int} height the height of the rectangle
     * @param {int} width the width of the rectangle
     * @constructor
     */
    function JsonObject(id, name, x, y, height, width){
        JsonAbstractCollection.call(this, id, name, JsonObject.TYPE, x, y, height, width, JsonObject.COLOR);
    }
    return JsonObject;
});
