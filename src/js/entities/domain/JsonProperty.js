define(['entities/domain/JsonAbstractEntity'],
    /* @lends JsonProperty*/ function(JsonAbstractEntity){

        JsonProperty.prototype = new JsonAbstractEntity();
        JsonProperty.prototype.constructor =JsonProperty;

        JsonProperty.TYPE = 'JsonProperty';
        JsonProperty.COLOR = '#87CEFA';
        /**
         * the json property of a domain
         * @param {string} id the id of the json property
         * @param {string} name the name of the json property
         * @param {int} x the x-position
         * @param {int} y the y-position
         * @param {int} width the width of the svg-rectangle
         * @param {int} height the height of the svg-rectangle
         * @param {string} value the example value
         * @param {string} valueType the type of the example value
         * @constructor
         */
        function JsonProperty(id, name, x, y, width, height, value, valueType){
            JsonAbstractEntity.call(this, id, name, JsonProperty.TYPE, x, y, width, height, JsonProperty.COLOR);

            /**
             * the value to the key
             * @type {string}
             * @private
             */
            var _value = value;

            /**
             * the type of the value
             * @type {string}
             * @private
             */
            var _valueType = valueType;

            /**
             * Get the example value of the json property
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
                return _valueType
            };

            /**
             * generates the svg element
             */
            this.generateSvgEntity = function(){
                JsonAbstractEntity.prototype.generateSvgEntity.call(this);
                this.get$node().popover({
                    'container' : 'body',
                    'title' : 'Example Value',
                    'placement' : 'top',
                    'trigger' : 'hover',
                    'content' : this.getValue()
                });

            }
        }
        /**
         * the json representation
         * @returns {object}
         */
        JsonProperty.prototype.toJSON = function(){
            var json = JsonAbstractEntity.prototype.toJSON.call(this);
            json.value = this.getValue();
            json.valueType =this.getValueType();
            return json;
        };


        return JsonProperty;
    });
