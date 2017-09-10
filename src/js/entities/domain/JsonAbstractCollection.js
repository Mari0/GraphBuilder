define(['entities/domain/JsonAbstractEntity'], /**@lends JsonAbstractCollection*/
    function (JsonAbstractEntity) {

        JsonAbstractCollection.prototype = new JsonAbstractEntity();
        JsonAbstractCollection.prototype = JsonAbstractCollection;

        /**
         * An abstract class for complex json data types
         * @param {string} id the identifier
         * @param {string} name the of the key assigned to the complex data type
         * @param {string} type the type, can be JsonObject or JsonArray
         * @param {int} x the x position of the svg-element
         * @param {int} y the y position of the svg-element
         * @param {string} color the color
         * @constructor
         */
        function JsonAbstractCollection(id, name, type, x, y, color) {
            JsonAbstractEntity.call(this, id, name, type, x, y, color);

            /**
             * the object which stores the properties
             * @type {object}
             * @private
             */
            var _object = {};

            /**
             * return the elements
             * @returns {Object}
             */
            this.getElements = function () {
                return _object;
            };
        }

        /**
         * the json representation of the json collection entity like array or object
         * @returns {Object}
         */
        JsonAbstractCollection.prototype.toJSON = function () {
            var json = JsonAbstractEntity.prototype.toJSON.call(this);
            json['properties'] = {};
            var elements = this.getElements();
            for (var key in elements) {
                if (elements.hasOwnProperty(key)) {
                    json.properties[key] = elements[key].toJSON();
                }
            }
            return json;
        };

        JsonAbstractCollection.prototype.generateSvgEntity = function () {
            JsonAbstractEntity.prototype.generateSvgEntity.call(this);

        };

        /**
         * adds an entity
         * @param entity
         * @returns {boolean}
         */
        JsonAbstractCollection.prototype.add = function (entity) {
            if (!entity) {
                return false;
            }
            var key = entity.getId();
            if (key && !this.getElements().hasOwnProperty(key)) {
                this.getElements()[key] = entity;
                if (!this.get$node()) {
                    this.generateSvgEntity();
                }
                if (!entity.get$node()) {
                    entity.generateSvgEntity();
                }
                this.get$node().children('.attributes').append(entity.get$node());
                return true;
            }

            return false;
        };

        return JsonAbstractCollection;
    });