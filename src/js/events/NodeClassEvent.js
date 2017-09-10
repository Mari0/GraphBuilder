define(['jquery',
    'lodash',
    'Global',
    'MappingManager',
    'entities/range/NodeClass',
    'entities/range/ClassProperty',
    'util/GUIDGenerator'],function ($,_, Global, MappingManager, NodeClass, ClassProperty, Guid) {

    function NodeClassEvent(){}

    var identifierList = [];

    var GetPropertiesOfSuperClasses = function (vertexClassName, properties) {

        var superClassName = Global.Ontology.vertex_classes[vertexClassName].super_class;
        if (Global.Ontology.vertex_classes.hasOwnProperty(superClassName)) {
            var superClass = Global.Ontology.vertex_classes[superClassName];
            identifierList = _.union(superClass.identifier, identifierList);
            properties = _.assign(superClass.properties, properties);

            if (superClass.super_class) {
                return GetPropertiesOfSuperClasses(superClassName, properties);
            }
        }
        return properties;
    };

    NodeClassEvent.CreateNodeClassEvent = function(className, x, y){
        if (!Global.Ontology) {
            console.log('No Ontology loaded!');
            return;
        }
        identifierList = _.union(identifierList,Global.Ontology.vertex_classes[className].identifier);
        var dataProperties = null;
        if (Global.Ontology.vertex_classes.hasOwnProperty(className)) {
            if(Global.Ontology.vertex_classes[className].hasOwnProperty('properties')) {
                dataProperties = Global.Ontology.vertex_classes[className].properties;
            }
        } else {
            dataProperties = {};
        }
        var superProperties = null;
        superProperties = GetPropertiesOfSuperClasses(className, superProperties);
        
        if(superProperties) {
            dataProperties = _.assign(superProperties, dataProperties);
        }


        var nodeClassId = Guid();
        var nodeClass = new NodeClass(nodeClassId, className, x,y,200,20);

        var yPos = y+20;
        for(var key in dataProperties){
            if(dataProperties.hasOwnProperty(key)){
                var property = new ClassProperty(key, dataProperties[key].type, nodeClass, x, yPos, 200, 20);
                if($.inArray(key, identifierList) > -1) {
                    property.enableIdentifier();
                }
                nodeClass.addProperty(property);
                yPos += 20;
            }
        }
        var canvas = MappingManager.getMappingCanvasById(Global.CurrentTabId);
        canvas.addNodeClass(nodeClass);


        identifierList = [];
    };

    return NodeClassEvent;
});