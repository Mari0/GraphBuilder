define(['Global',
    'entities/AbstractEntity',
    'entities/range/ClassProperty',
    'util/TransformCoordinates'
    ],function (Global, AbstractEntity, ClassProperty, TransformCoords) {

    AbstractClass.prototype = new AbstractEntity();
    AbstractClass.prototype.constructor = AbstractClass;
    /**
     * A abstract graph class
     * @param {string} id the identifier of the class
     * @param {string} name the label of the class
     * @constructor
     */
    function AbstractClass(id, name){
        AbstractEntity.call(this,id,name);

        var _$node = null;

        var _properties = {};

        this.getProperties = function(){
            return _properties;
        };

        this.get$node = function(){
            return _$node;
        };

        this.set$node =function($node){
            _$node = $node;
        }

    }

    AbstractClass.prototype.toJSON = function(){
        var json = AbstractEntity.prototype.toJSON.call(this);
        if(this.OFFSETX && this.OFFSETY) {
            json.offset_x = this.OFFSETX;
            json.offset_y = this.OFFSETY;
        }
        json.properties = {};
        var properties = this.getProperties();
        for(var key in properties){
            if(properties.hasOwnProperty(key)){
                json.properties[key]  = properties[key].toJSON();
            }
        }
        return json;
    };

    /**
     * get a property by its name
     * @param {string} id the name of the property
     * @returns {*}
     */
    AbstractClass.prototype.getPropertyById = function(id){
        var properties = this.getProperties();
        return properties.hasOwnProperty(id) ? properties[id] : null;
    };

    /**
     * adds a property to the class
     * @param {object} entity
     * @returns {boolean}
     */
    AbstractClass.prototype.addProperty = function(entity){
        var properties = this.getProperties();
        if(entity instanceof ClassProperty){
            if(!properties.hasOwnProperty(entity.getId())){
                properties[entity.getId()] = entity;

                if(entity.isIdentifier()) {
                    this.setIdentifier(entity);
                }

                if(this.get$node()) {
                    this.get$node().append(entity.get$node());
                }
                return true;
            }
        }
        return false;
    };

    AbstractClass.prototype.getAllMappingRules = function(){
        var properties = this.getProperties();
        var mappingRules = {};
        for(var key in properties){
            if(properties.hasOwnProperty(key)){
                var mappingRule = properties[key].getMappingRule();
                if(mappingRule){
                    mappingRules[mappingRule.getId()] = mappingRule;
                }
            }
        }
        return mappingRules;
    };

    AbstractClass.prototype.deleteProperty = function(property, disableRedraw){
        if( property instanceof  ClassProperty){
            this.deletePropertyById(property.getId(), disableRedraw);
        }
    };

    AbstractClass.prototype.deletePropertyById = function(id, disableRedraw){

        var properties = this.getProperties();
        if(properties.hasOwnProperty(id)){
            //Redraw the NodeClass
            var yPos = properties[id].Y;
            var height = properties[id].getHeight();
            var width = properties[id].getWidth();

            properties[id].get$node().remove();
            properties[id].deleteMappingRule();
            delete properties[id];

            if(disableRedraw) {
                return;
            }

            var KEY_ICON = Global.Config.ICONS.KEY;
            var GEAR_ICON = Global.Config.ICONS.GEAR;
            for(var key in properties){
                if(properties.hasOwnProperty(key)){
                    if(properties[key].Y > yPos){
                        //recalculate position of the class properties
                        properties[key].Y -= height;
                        properties[key].get$node().children('rect').attr('y', properties[key].Y);
                        properties[key].get$node().children('text').attr('y', (2 *  properties[key].Y + height) / 2);
                        properties[key].get$node().children('.icon-key').attr('transform', 'translate(' + (((2 *  properties[key].X + width) / 2) + KEY_ICON.OFFSET_X) + ',' + (((2 * properties[key].Y + height) / 2) + KEY_ICON.OFFSET_Y) + ') scale('+ KEY_ICON.SCALE+')');
                        properties[key].get$node().children('.icon-gear').attr('transform', 'translate(' + (((2 *  properties[key].X + width) / 2) + GEAR_ICON.OFFSET_X) + ',' + (((2 * properties[key].Y + height) / 2) + GEAR_ICON.OFFSET_Y) + ') scale('+ GEAR_ICON.SCALE+')');

                        //adjust mapping rule
                        var mappingRule = properties[key].getMappingRule();
                        if(mappingRule) {
                            var translateCoords = TransformCoords(this.get$node());
                            mappingRule.get$node().children('line').attr('x2', properties[key].X + translateCoords.x - 13);
                            mappingRule.get$node().children('line').attr('y2', properties[key].Y + translateCoords.y + (properties[key].getHeight() / 2));
                        }
                    }
                }
            }
        }
    };

    AbstractClass.prototype.setPropertiesVisibility = function(visibility){
        this.get$node().find('.ClassProperty')[visibility]();
        this.setMappingRulesVisibility(visibility);
    };

    AbstractClass.prototype.setMappingRulesVisibility = function(visibility){
        var mappingRules = this.getAllMappingRules();
        for(var ruleKey in mappingRules){
            if(mappingRules.hasOwnProperty(ruleKey)){
                mappingRules[ruleKey].get$node()[visibility]();
            }
        }
    };

    AbstractClass.prototype.OFFSETX = null;
    AbstractClass.prototype.OFFSETY = null;
    return AbstractClass;
});