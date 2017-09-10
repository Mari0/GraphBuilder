define(['entities/AbstractEntity',
        'util/TransformCoordinates',
        'svg/SvgMappingRule'
    ],
    /**@lends MappingRule*/ function (AbstractEntity, TransformCoords, SvgMappingRule) {

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
        function MappingRule(id, domain, range){
            AbstractEntity.call(this, id, null);

            var _$node = null;

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

            var translateCoords = TransformCoords(range.get$node().parents('.NodeClass'));
            var x1 = domain.X + domain.Width;
            var y1 = domain.Y + (domain.Height / 2);

            var x2 = range.X + translateCoords.x - 13;
            var y2 = range.Y + translateCoords.y + (range.getHeight() / 2);

            /**
             * Get the domain
             */
            this.getDomain = function(){
                return _domain;
            };

            /**
             * Get the range
             */
            this.getRange= function () {
                return _range;
            };

            this.get$node = function(){
                return _$node;
            };

            this.generateSvg = function(){
                _$node = SvgMappingRule(id, MappingRule.TYPE, x1, y1, x2, y2);
                _$node.hover(function(){
                    _domain.get$node().trigger('mouseover');
                    _range.get$node().trigger('mouseover');
                }, function(){
                    _domain.get$node().trigger('mouseout');
                    _range.get$node().trigger('mouseout');
                });
            }

        }
        MappingRule.prototype.toJSON = function(){
            var json ={};
            json.domain = this.getDomain().getId();
            json.range = this.getRange().getId();
            return json;
        };

        MappingRule.prototype.generateSvgEntity = function(){
            this.generateSvg();
        };

        MappingRule.prototype.repaint = function(){
            var domain = this.getDomain(), range = this.getRange();

            var translateCoords = TransformCoords(range.get$node().parents('.NodeClass'));
            var x1 = domain.X + domain.Width;
            var y1 = domain.Y + (domain.Height / 2);

            var x2 = range.X + translateCoords.x - 13;
            var y2 = range.Y + translateCoords.y + (range.getHeight() / 2);

            var $node = this.get$node();
            $node.find('line').attr('x1',x1).attr('y1', y1).attr('x2',x2).attr('y2',y2);

        };


        return MappingRule;
});