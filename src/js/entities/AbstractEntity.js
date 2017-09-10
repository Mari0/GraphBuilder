define([], function(){

        /**
         * An abstract entity class
         * @param {string} id the identifier of the entity
         * @param {string} name the name of the entity
         * @constructor
         */
        function AbstractEntity(id, name){

            /**
             * the identifier
             * @type {string}
             * @private
             */
            var _id = id;

            /**
             * the name of the entity
             * @type {string}
             * @private
             */
            var _name = name;

            /**
             * returns the identifier of the entity
             * @returns {string}
             */
            this.getId = function(){
                return _id;
            };

            this.getName = function(){
                return name;
            };

            this.setName = function(name){
                _name = name;
            };

        }
        /**
         * Returns the json representation of a json entity
         * @returns {object}
         */
        AbstractEntity.prototype.toJSON = function(){
            return {
                name: this.getName()
            }
        };


        return AbstractEntity;
    }
);
