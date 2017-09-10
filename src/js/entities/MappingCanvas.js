define(['Global',
    'svg/SvgCanvas',
    'entities/range/NodeClass',
    'entities/range/EdgeClass',
    'entities/range/ClassProperty',
    'entities/MappingRule',
    'entities/domain/JsonArray',
    'entities/domain/JsonObject',
    'entities/domain/JsonProperty'
    ], /**@lends MappingCanvas*/ function(Global, svgCanvas, NodeClass, EdgeClass, ClassProperty, MappingRule, JsonArray, JsonObject, JsonProperty){

    /**
     *
     * @param id
     * @param width
     * @param height
     *@param tabId
     * @constructor
     */
    function MappingCanvas(id, width, height, tabId){
        /**
         * the identifier of the mapping canvas
         * @private
         */
        var _id = id;
        var _tabId = tabId;

        //var _width = width;

        var _height = height;

        var _nodeClasses = {};
        var _edgeClasses = {};

        var _mappingRules = {};

        var _domain = null;

        var $node = svgCanvas(id, width, height);

        this.getId = function(){
            return _id;
        };

        this.getTabId = function(){
            return _tabId
        };

        this.setTabId = function(tabId){
            _tabId = tabId;
        };

        this.get$node = function(){
            return $node;
        };

        this.set$node = function($mapping){
            $node = $mapping;
        };

        this.getNodeClasses = function(){
            return _nodeClasses;
        };

        this.getEdgeClasses = function(){
          return _edgeClasses;
        };

        this.setDomain = function(domain){
            _domain = {};
            _domain['$'] = domain;
            setDomainHelper(domain);
            $node.append(domain.get$node());
        };

        var setDomainHelper = function(element){
            var elements = element.getElements();
            for(var key in elements){
                if(elements.hasOwnProperty(key)){
                    if(elements[key] instanceof JsonObject || elements[key] instanceof JsonArray){
                        _domain[key] = elements[key];
                        setDomainHelper(elements[key]);
                    }else{
                        _domain[key] = elements[key];
                    }
                }
            }
        };

        this.getDomain = function(){
            return _domain;
        };

        this.getMappingRules = function(){
            return _mappingRules;
        };

        this.getHeight = function(){
            return _height;
        };
        this.getWidth = function(){
            return width;
        };
    }

    MappingCanvas.CreateMappingFromJSON = function(json){
        var maxHeight = 0;
        var domainHelper = function(json, root, depth){
            depth +=1;
            var xPos = depth * Global.Config.DOMAIN.OFFSET + Global.Config.DOMAIN.X;
            for(var key in json){
                if(json.hasOwnProperty(key)){
                    var entity = json[key];
                    maxHeight = maxHeight < entity.y ? entity.y : maxHeight;
                    switch(json[key].type){
                        case 'JsonProperty':{
                            root.add(new JsonProperty(key, entity.name, xPos, entity.y,Global.Config.DOMAIN.WIDTH, Global.Config.DOMAIN.HEIGHT, entity.value, entity.valueType));
                            break;
                        }
                        case 'JsonObject':{
                            var jsonObject = new JsonObject(key, entity.name, xPos, entity.y, Global.Config.DOMAIN.WIDTH, Global.Config.DOMAIN.HEIGHT);
                            root.add(jsonObject);
                            domainHelper(entity.properties, jsonObject, depth);
                            break;
                        }
                        case 'JsonArray':{
                            var jsonArray = new JsonArray(key, entity.name, xPos, entity.y,Global.Config.DOMAIN.WIDTH, Global.Config.DOMAIN.HEIGHT, entity.value, entity.valueType);
                            root.add(jsonArray);
                            domainHelper(entity.properties, jsonArray, depth);
                            break;
                        }
                    }
                }
            }
        };
        var root = new JsonObject('$','root', Global.Config.DOMAIN.X, Global.Config.DOMAIN.Y, Global.Config.DOMAIN.WIDTH, Global.Config.DOMAIN.HEIGHT);
        var properties = json.domain.properties;
        var depth = 0;
        domainHelper(properties, root, depth);
        var canvas = new MappingCanvas('Import', '100%', maxHeight +200);
        canvas.setDomain(root);

        //Initialize NodeClasses
        var jsonNodeClasses = json.nodeClasses;
        for(var key in jsonNodeClasses){
            if(jsonNodeClasses.hasOwnProperty(key)){
                var jsonNodeClass = jsonNodeClasses[key];

                var x,y;
                if(jsonNodeClass.offset_x && jsonNodeClass.offset_y){
                    x = jsonNodeClass.x + jsonNodeClass.offset_x;
                    y = jsonNodeClass.y + jsonNodeClass.offset_y;
                }
                else{
                    x = jsonNodeClass.x;
                    y = jsonNodeClass.y;
                }

                var nodeClass = new NodeClass(key, jsonNodeClass.name, x, y, Global.Config.DOMAIN.WIDTH, Global.Config.DOMAIN.HEIGHT);
                if(jsonNodeClass.isReference) {
                    nodeClass.enableReference();
                }

                for(var key2 in jsonNodeClass.properties){
                    if(jsonNodeClass.properties.hasOwnProperty(key2)){
                        var jsonClassProperty = jsonNodeClass.properties[key2];
                        y = jsonNodeClass.offset_y ? jsonClassProperty.y + jsonNodeClass.offset_y : jsonClassProperty.y;
                        var classProperty = new ClassProperty(jsonClassProperty.name, jsonClassProperty.type, nodeClass, x, y, Global.Config.DOMAIN.WIDTH, Global.Config.DOMAIN.HEIGHT);
                        if(jsonClassProperty.hasOwnProperty('isIdentifier') && jsonClassProperty.isIdentifier) {
                            classProperty.enableIdentifier();
                        }
                        nodeClass.addProperty(classProperty);
                    }
                }
                canvas.addNodeClass(nodeClass);
            }
        }

        var jsonEdgeClasses = json.edgeClasses;
        for(var edgeClassKey in jsonEdgeClasses){
            if(jsonEdgeClasses.hasOwnProperty(edgeClassKey)){
                var jsonEdgeClass = jsonEdgeClasses[edgeClassKey];
                var sourceClass = canvas.getNodeClassById(jsonEdgeClass.source);
                var targetClass = canvas.getNodeClassById(jsonEdgeClass.target);
                if(sourceClass && targetClass) {
                    var edgeClass = new EdgeClass(edgeClassKey, jsonEdgeClass.name,sourceClass, targetClass);
                    if(jsonEdgeClass.offset_x && jsonEdgeClass.offset_y){
                        edgeClass.OFFSETX = jsonEdgeClass.offset_x;
                        edgeClass.OFFSETY = jsonEdgeClass.offset_y;
                    }
                    canvas.addEdgeClass(edgeClass);
                    //TODO Properties
                }
            }
        }

        var jsonMappingRules =json.mappingRules;
        for(var mappingRuleKey in jsonMappingRules){
            if(jsonMappingRules.hasOwnProperty(mappingRuleKey)){
                var jsonMappingRule = jsonMappingRules[mappingRuleKey];
                var domain = canvas.getDomainEntityById(jsonMappingRule.domain);
                var range = canvas.getClassPropertyById(jsonMappingRule.range);
                var mappingRule = new MappingRule(mappingRuleKey, domain, range);
                canvas.addMappingRule(mappingRule);
            }
        }


        return canvas;

    };

    MappingCanvas.prototype.toJSON = function(){
        var json = {
            domain: null,
            nodeClasses:{},
            edgeClasses: {},
            mappingRules:{}
        };
        json.domain = this.getDomain()['$'].toJSON();
        var nodeClasses = this.getNodeClasses();
        for(var key in nodeClasses){
            if(nodeClasses.hasOwnProperty(key)){
                json.nodeClasses[key] = nodeClasses[key].toJSON();
            }
        }

        var edgeClasses = this.getEdgeClasses();
        for(var key2 in edgeClasses){
            if(edgeClasses.hasOwnProperty(key2)){
                json.edgeClasses[key2] = edgeClasses[key2].toJSON();
            }
        }

        var mappingRules = this.getMappingRules();
        for(var key3 in mappingRules){
            if(mappingRules.hasOwnProperty(key3)){
                json.mappingRules[key3] = mappingRules[key3].toJSON();
            }
        }
        return json;

    };

    /**
     * Get a NodeClass by its identifier
     * @param id the identifier of the NodeClass
     * @returns {object}
     */
    MappingCanvas.prototype.getNodeClassById = function(id){
        var nodeClasses = this.getNodeClasses();
        if(nodeClasses.hasOwnProperty(id)){
            return nodeClasses[id];
        }
    };

    /**
     *  Get EdgeClass by its identifier
     * @param id the identifier of the EdgeClass
     * @returns {*}
     */
    MappingCanvas.prototype.getEdgeClassById = function(id){
      var edgeClasses = this.getEdgeClasses();
        if(edgeClasses.hasOwnProperty(id)){
            return edgeClasses[id];
        }
    };

    /**
     * Adds a NodeClass to the canvas
     * @param nodeClass the NodeClass to add to the canvas
     * @returns {boolean}
     */
    MappingCanvas.prototype.addNodeClass =  function(nodeClass){
        if(nodeClass instanceof NodeClass) {
            nodeClass.generateSvgEntity();
            this.get$node().append(nodeClass.get$node());
            this.getNodeClasses()[nodeClass.getId()] = nodeClass;
        }
        return false;
    };

    /**
     * Adds a edgeClass to the mapping canvas
     * @param edgeClass the edge class to add to canvas
     * @returns {boolean}
     */
    MappingCanvas.prototype.addEdgeClass = function(edgeClass){
        if(edgeClass instanceof EdgeClass) {
            edgeClass.generateSvgEntity();
           this.get$node().append(edgeClass.get$node());
           this.getEdgeClasses()[edgeClass.getId()] = edgeClass;
        }
        return false;
    };

    /**
     * Adds a MappingRule to the mapping canvas
     * @param mappingRule the mapping rule to add the canvas
     * @returns {boolean}
     */
    MappingCanvas.prototype.addMappingRule = function(mappingRule){
        if(mappingRule instanceof MappingRule){
            var rules = this.getMappingRules();
            var id = mappingRule.getId();
            if(!rules.hasOwnProperty(id)){
                mappingRule.generateSvgEntity();
                rules[id] = mappingRule;
                mappingRule.getRange().setMappingRule(mappingRule);
                this.get$node().append(mappingRule.get$node());
                return true;
            }
        }
        return false;
    };

    MappingCanvas.prototype.getDomainEntityById = function(id){
        var domain = this.getDomain();
        return domain.hasOwnProperty(id) ? domain[id] : null;
    };

    MappingCanvas.prototype.deleteMappingRuleById = function(id){
        var mappingRules = this.getMappingRules();
        if(mappingRules.hasOwnProperty(id)){
            mappingRules[id].get$node().remove();
            delete mappingRules[id];
        }
    };

    MappingCanvas.prototype.deleteEdgeClassById = function(id){
        var edgeClasses = this.getEdgeClasses();
        if(edgeClasses.hasOwnProperty(id)){
            edgeClasses[id].get$node().remove();
            delete edgeClasses[id];
        }
    };

    MappingCanvas.prototype.deleteNodeClassById = function(id){
      var nodeClasses = this.getNodeClasses();
        if(nodeClasses.hasOwnProperty(id)){
            var mappingRules = nodeClasses[id].getAllMappingRules();
            for(var key in mappingRules){
                if(mappingRules.hasOwnProperty(key)){
                    this.deleteMappingRuleById(key);
                }
            }

           var edgeClasses =  nodeClasses[id].getAllEdges();
            for(var key2 in edgeClasses){
                if(edgeClasses.hasOwnProperty(key2)){
                    this.deleteEdgeClassById(key2);
                }
            }
            nodeClasses[id].get$node().remove();
            delete nodeClasses[id];

        }
    };

    MappingCanvas.prototype.getClassPropertyById = function(id){
        var nodeClass = this.getNodeClassById(id.replace(/#\w*/g, ''));
        if(nodeClass){
            return nodeClass.getPropertyById(id);
        }
        return null;
    };

    MappingCanvas.prototype.generateSvg = function(){
        var $node = svgCanvas(this.getId(), this.getWidth(), this.getHeight());

        var domain = this.getDomain();
        for(var key0 in domain){
            if(domain.hasOwnProperty(key0)){
                domain[key0].generateSvgEntity();
                $node.append(domain[key0].get$node());
            }
        }

        var nodeClasses = this.getNodeClasses();
        for(var key in nodeClasses){
            if(nodeClasses.hasOwnProperty(key)) {
                nodeClasses[key].generateSvgEntity();
                $node.append(nodeClasses[key].get$node());
            }
        }

        var edgeClasses = this.getEdgeClasses();
        for(var key2 in edgeClasses){
            if(edgeClasses.hasOwnProperty(key2)) {
                edgeClasses[key2].generateSvgEntity();
                $node.append(edgeClasses[key2].get$node());
            }
        }

        var mappingRules = this.getMappingRules();
        for(var key3 in mappingRules){
            if(mappingRules.hasOwnProperty(key3)) {
                mappingRules[key3].generateSvgEntity();
                $node.append(mappingRules[key3].get$node());
            }
        }
        this.set$node($node);

    };

    MappingCanvas.prototype.repaintDomain = function(){
        var num=1;
        var root = this.getDomain()['$'];
        root.X = Global.Config.DOMAIN.X;
        root.Y = Global.Config.DOMAIN.Y;

        function repaintDomainHelper(e, d){
            d = d+1;
            var entities = e.getElements();
            for(var key in entities){
                if(entities.hasOwnProperty(key)){
                    var entity = entities[key];
                    entity.X = Global.Config.DOMAIN.X + Global.Config.DOMAIN.OFFSET * d;
                    entity.Y = Global.Config.DOMAIN.Y + num * Global.Config.DOMAIN.HEIGHT;
                    var $node = entity.get$node();
                    $node.find('rect')
                        .attr('x', entity.X)
                        .attr('y', entity.Y);
                    $node.find('text')
                        .attr('x',(2 * entity.X + Global.Config.DOMAIN.WIDTH) / 2)
                        .attr('y', (2 * entity.Y + Global.Config.DOMAIN.HEIGHT) / 2);

                    num++;
                    if(entity instanceof JsonArray || entity instanceof JsonObject){
                        repaintDomainHelper(entity, d);
                    }
                }
            }
        }
        repaintDomainHelper(root, 0);
        this.get$node().attr('height', Global.Config.DOMAIN.Y + num * Global.Config.DOMAIN.HEIGHT + 200);
    };

    return MappingCanvas;
});
