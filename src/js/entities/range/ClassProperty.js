define([
    'jquery',
    'Global',
    'entities/AbstractEntity',
    'svg/SvgEntity',
    'panels/ClassPropertyPanel'
], function($, Global, AbstractEntity, SvgEntity, ClassPropertyPanel){

    ClassProperty.prototype = new AbstractEntity();
    ClassProperty.prototype.constructor = ClassProperty;
    ClassProperty.TYPE = 'ClassProperty';
    ClassProperty.DEFAULT_COLOR = '#87CEFA';
    ClassProperty.IDENTIFIER_COLOR = 'yellow';


    function ClassProperty(name, type, refNodeClass, x, y, width, height){
        var that = this;
        AbstractEntity.call(this, refNodeClass.getId() + '#' + name, name);

        /**
         * The type of the ClassProperty
         * @private
         */
        var _type = type;

         var _isIdentifier = false;

        this.X = x;
        this.Y = y;

        var _width = width;
        var _height = height;

        var _mappingRule = null;

        var _nodeClass = refNodeClass;

        var _$node = null;

        this.getMappingRule = function(){
            return _mappingRule;
        };

        this.setMappingRule = function(mappingRule){
            _mappingRule = mappingRule;
        };

        this.getType = function(){
            return _type;
        };

        this.get$node = function(){
            if(!_$node) {
                that.generateSvgEntity();
            }
            return _$node;
        };

        this.getWidth = function () {
            return _width;
        };

        this.getHeight = function(){
            return _height;
        };

        this.getNodeClass = function(){
            return _nodeClass;
        };

        this.isIdentifier = function(){
          return _isIdentifier;
        };

        this.enableIdentifier = function(){
          _isIdentifier = true;
            _nodeClass.setIdentifier(that);
            if(_$node){
                _$node.find('rect').css('fill', ClassProperty.IDENTIFIER_COLOR);
                var KEY_ICON = Global.Config.ICONS.KEY;
                var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
                use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#keyIcon');
                $(use).attr('class','icon-key')
                    .attr('pointer-events', 'none')
                    .attr('transform', 'translate(' + (((2 * that.X + width) / 2) + KEY_ICON.OFFSET_X) + ',' + (((2 * that.Y + height) / 2) + KEY_ICON.OFFSET_Y) + ') scale('+ KEY_ICON.SCALE +')');
                _$node.append(use);

            }

        };

        this.disableIdentifier = function(){
            _nodeClass.setIdentifier(null);
            _isIdentifier = false;
            _$node.find('rect').css('fill', ClassProperty.DEFAULT_COLOR);
            _$node.find('.icon-key').remove();
        };

        this.generateSvg = function(){
            if(!this.isIdentifier()) {
                _$node = SvgEntity(that.getId(), ClassProperty.TYPE, that.Name, that.X, that.Y, that.getWidth(), that.getHeight(), ClassProperty.DEFAULT_COLOR);
            }
            else {
                _$node = SvgEntity(that.getId(), ClassProperty.TYPE, that.Name, that.X, that.Y, that.getWidth(), that.getHeight(), ClassProperty.IDENTIFIER_COLOR);

                var KEY_ICON = Global.Config.ICONS.KEY;
                var use = document.createElementNS("http://www.w3.org/2000/svg", "use");
                use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', '#keyIcon');
                $(use)
                    .attr('class','icon-key')
                    .attr('pointer-events', 'none')
                    .attr('transform', 'translate(' + (((2 * x + width) / 2) + KEY_ICON.OFFSET_X) + ',' + (((2 * y + height) / 2) + KEY_ICON.OFFSET_Y) + ') scale('+ KEY_ICON.SCALE +')');
                _$node.append(use);
            }
            _$node.find('.icon-gear').click(function(){
                ClassPropertyPanel(that);
                //.css('background', that.IsIdentifier? ClassProperty.IDENTIFIER_COLOR : ClassProperty.DEFAULT_COLOR);
            })

        };
    }

    ClassProperty.prototype.toJSON = function(){
        var json = AbstractEntity.prototype.toJSON.call(this);
        //json.x = this.X;
        json.y = this.Y;
        //json.width = this.getWidth();
        //json.height = this.getHeight();
        json.type = this.getType();
        if(this.isIdentifier()) {
            json.isIdentifier = this.isIdentifier();
        }
        return json;
    };
    ClassProperty.prototype.generateSvgEntity = function(){
        this.generateSvg();
    };
    ClassProperty.prototype.deleteMappingRule = function(){
       var mappingRule = this.getMappingRule();
        if(mappingRule) {
            mappingRule.get$node().remove();
            this.setMappingRule(null);
        }
    };
    ClassProperty.prototype.editName = function(name, isIdentifier){
        var nodeClass = this.getNodeClass();
        var newProp = new ClassProperty(name, this.getType(), nodeClass, this.X, this.Y, this.getWidth(), this.getHeight());
        newProp.IsIdentifier = isIdentifier;
        if(nodeClass.addProperty(newProp)) {
            nodeClass.deleteProperty(this, true);
            return true;
        }
        else{
            return false;
        }
    };

    return ClassProperty;
});