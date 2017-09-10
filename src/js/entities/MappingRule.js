define(['entities/AbstractEntity'
    ],
    /**@lends MappingRule*/ function (AbstractEntity) {

        MappingRule.prototype = new AbstractEntity();
        MappingRule.prototype.constructor = MappingRule;
        MappingRule.TYPE = 'MappingRule';
        MappingRule.COLOR = '#87CEFA';

        /**
         *
         * @param id
         * @param domain
         * @param range
         * @constructor
         */
        function MappingRule(id, domain, range) {
            var that = this;
            AbstractEntity.call(this, id, null);

            /**
             * the domain of the rule
             * @private
             */
            var _domain = domain;

            /**
             * the range of the rule
             * @private
             */
            var _range = range;

            /**
             * Get the domain
             */
            that.getDomain = function(){
                return _domain;
            };

            /**
             * Get the range
             */
            that.getRange= function () {
                return _range;
            };


        }
        MappingRule.prototype.toJSON = function(){
            var json ={};
            json.domain = this.getDomain().getId();
            json.range = this.getRange().getId();
            return json;
        };

        return MappingRule;
});