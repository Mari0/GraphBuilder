define(['Global',
    'entities/AbstractEntity',
    'entities/range/ClassProperty'
    ],function (Global, AbstractEntity, ClassProperty) {

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
        };

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
                    this.get$node().find('.attributes').append(entity.get$node());
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

            properties[id].get$node().remove();
            properties[id].deleteMappingRule();
            delete properties[id];

            if(disableRedraw) {
                return;
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