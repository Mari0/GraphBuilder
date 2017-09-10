define(['entities/AbstractEntity',
        //'text!tpl/svgEntity.html',
        'svg/SvgEntity',
        'util/JPath'
    ], /*@lends JsonAbstractEntity*/
    function(AbstractEntity, /* htmlSvgEntity,*/ SvgEntity, JPath){

        JsonAbstractEntity.prototype = new AbstractEntity();
        JsonAbstractEntity.prototype.constructor = JsonAbstractEntity;

        /**
         * an abstract json entity
         * @param {string} id
         * @param name
         * @param type
         * @param x
         * @param y
         * @param width
         * @param height
         * @param color
         * @constructor
         */
        function JsonAbstractEntity(id, name, type, x, y, width, height, color){
            var that = this;
            AbstractEntity.call(this, id, name);

            this.JsonPath = new JPath(id);

            /**
             * the svg element in jquery object
             * @type {object}
             * @private
             */
            var $node = null;

            this.X = x;
            this.Y = y;

            this.Width = width;
            this.Height = height;

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
                return $node;
            };

            /**
             * Get the type of the entity
             * @returns {string}
             */
            this.getType = function(){
                return _type;
            };

            /**
             * generates the svg-element
             */
            this._generateSvg = function(){
                $node = SvgEntity(id, type, name, that.X,that.Y, that.Width, that.Height, color);
            };

        }
        JsonAbstractEntity.prototype.generateSvgEntity = function(){
            this._generateSvg();
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