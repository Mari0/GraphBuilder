define([
    'jquery',
    'lodash',
    'Global',
    'entities/AbstractEntity',
    'panels/ClassPropertyPanel',
    'text!tpl/entity.html'
], function($,_, Global, AbstractEntity, ClassPropertyPanel,htmlEntity){

    ClassProperty.prototype = new AbstractEntity();
    ClassProperty.prototype.constructor = ClassProperty;
    ClassProperty.TYPE = 'ClassProperty';
    ClassProperty.DEFAULT_COLOR = '#87CEFA';
    ClassProperty.IDENTIFIER_COLOR = 'yellow';


    function ClassProperty(name, type, refNodeClass, x, y){
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
            return _$node;
        };

        this.set$node = function($node){
            _$node = $node;
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
            }

        };

        this.disableIdentifier = function(){
            _nodeClass.setIdentifier(null);
            _isIdentifier = false;
            _$node.find('rect').css('fill', ClassProperty.DEFAULT_COLOR);
        };

    }

    ClassProperty.prototype.toJSON = function(){
        var json = AbstractEntity.prototype.toJSON.call(this);
        //json.x = this.X;
        json.y = this.Y;
        json.type = this.getType();
        if(this.isIdentifier()) {
            json.isIdentifier = this.isIdentifier();
        }
        return json;
    };

    ClassProperty.prototype.generateSvgEntity = function(){
        var that = this;
        var _$node;
        _$node = $(_.template(htmlEntity)({
            id:this.getId(),
            type:ClassProperty.TYPE,
            x: this.X,
            y:this.Y,
            color:ClassProperty.DEFAULT_COLOR,
            label:this.getName()
        }));

        if(this.isIdentifier()) {
            _$node.addClass('identifier');
        }

        _$node.click(function(){
            ClassPropertyPanel(that);
            //.css('background', that.IsIdentifier? ClassProperty.IDENTIFIER_COLOR : ClassProperty.DEFAULT_COLOR);
        });

        this.set$node(_$node);
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
        var newProp = new ClassProperty(name, this.getType(), nodeClass, this.X, this.Y);
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