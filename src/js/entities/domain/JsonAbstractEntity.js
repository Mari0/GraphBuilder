/*global define, $, _*/
define(['entities/AbstractEntity',
       'text!tpl/entityClass.html',
        'util/JPath'
    ], /*@lends JsonAbstractEntity*/
    function(AbstractEntity, entityHtml, JPath){

        JsonAbstractEntity.prototype = new AbstractEntity();
        JsonAbstractEntity.prototype.constructor = JsonAbstractEntity;

        /**
         * an abstract json entity
         * @param {string} id
         * @param name
         * @param type
         * @param x
         * @param y
         * @param color
         * @constructor
         */
        function JsonAbstractEntity(id, name, type, x, y, color){
            AbstractEntity.call(this, id, name);

            var _color = color;

            this.JsonPath = new JPath(id);

            /**
             * the svg element in jquery object
             * @type {object}
             * @private
             */
            var _$node = null;

            this.X = x;
            this.Y = y;

            /**
             * the type of the json entity
             * @type {string}
             * @private
             */
            var _type = type;

            /**
             * return the svg entity as jquery object
             * @returns {Object}
             */
            this.get$node = function(){
                return _$node;
            };

            this.set$node = function($node){
                _$node = $node;
            };

            /**
             * Get the type of the entity
             * @returns {string}
             */
            this.getType = function(){
                return _type;
            };

            this.getColor = function(){
                return _color;
            };

        }
        JsonAbstractEntity.prototype.generateSvgEntity = function(){
            var $node = $(_.template(entityHtml)({
                id: this.getId(),
                type: this.getType(),
                label:this.getName(),
                x:this.X,
                y:this.Y,
                color:this.getColor()
            }));
            $node.draggable({
                axis:'y',
                containment:'parent'
            });
            this.set$node($node);
        };

        JsonAbstractEntity.prototype.toJSON = function(){
            var json = AbstractEntity.prototype.toJSON.call(this);
            json.type = this.getType();
            //json.x = this.X;
            json.y = this.Y;
            return json;
        };
        return JsonAbstractEntity;
    });