define([
        'entities/domain/JsonAbstractCollection'
    ], /*@lends JsonArray */
    function(JsonAbstractCollection){

        JsonArray.prototype = new JsonAbstractCollection();
        JsonArray.prototype.constructor = JsonArray;

        JsonArray.TYPE = 'JsonArray';
        JsonArray.COLOR = '#104E8B';

        /**
         * A JsonArray of the Domain
         * @param {string} id the identifier of the array
         * @param {string} name the name of the key assigned to the array
         * @param {int} x the x-position of the svg-rectangle
         * @param {int} y the y-position of the svg-rectangle
         * @param {int} width the width of the svg-rectangle
         * @param {int} height the height of the svg-rectangle
         * @param {string} value the example value for primitive array
         * @param {string} valueType the type of the example value
         * @constructor
         */
        function JsonArray(id, name, x, y, width, height, value, valueType){
            JsonAbstractCollection.call(this,id, name, JsonArray.TYPE, x, y, width, height, JsonArray.COLOR);

            /**
             * the example value
             * @type {string}
             * @private
             */
            var _value = value;

            /**
             * the type of the example value
             * @type {string}
             * @private
             */
            var _valueType = valueType;

            /**
             * Get the example value of the primitive array
             * @returns {string}
             */
            this.getValue = function(){
                return _value;
            };

            /**
             * Get the type of the example value
             * @returns {string}
             */
            this.getValueType = function(){
                return _valueType;
            };
        }

        /**
         * the json representation
         * @returns {Object}
         */
        JsonArray.prototype.toJSON = function(){
            var json = JsonAbstractCollection.prototype.toJSON.call(this);
            var val = this.getValue();
            if(val) {
                json['value'] = val;
            }
            var valType = this.getValueType();
            if(valType) {
                json['valueType'] = valType;
            }
            return json;
        };

        /**
         * generates svg element
         */
        JsonArray.prototype.generateSvgEntity = function(){
            JsonAbstractCollection.prototype.generateSvgEntity.call(this);
            if(this.getValue()) {
                this.get$node().popover({
                    'container': 'body',
                    'title': '1st Element of primitive Array',
                    'placement': 'top',
                    'trigger': 'hover',
                    'content': this.getValue()
                });
            }
        };

        return JsonArray;
});
