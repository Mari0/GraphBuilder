define(['lodash',
        'Global',
        'entities/MappingCanvas',
        'util/JPath',
        'util/GUIDGenerator',
        'NetworkVis',
        'vis'],
    /**@lends NetworkManager*/ function (_, Global, MappingCanvas, JPath, Guid, NetworkVis, vis) {

        function NetworkManager(){
            var _network = null;
            var _keyMap = {};

            var _nodes = new vis.DataSet();
            var _edges = new vis.DataSet();
            var _clusters = [];

            return {
                map: function(mapping, data){
                    var that = this;
                    var NETWORK = Global.Config.NETWORK;

                    if (!mapping instanceof MappingCanvas) {
                        return new Error('Not a valid mapping object');
                    }

                    var _instanceMap = {};
                    var _originMap = {};

                    var offset, clusterId = 0;

                    var createVertices = function(nodeClass){
                        var rootPath, rootData = null;
                        var className= nodeClass.Name;
                        var identifier = nodeClass.getIdentifier();

                        var initRoot = function(domain){
                            var jPath = new JPath(domain.getId());

                            rootPath = jPath.GetRoot();
                            if(rootPath.Path !== '$'){
                                if(rootPath.ContainsArray()) {
                                    rootPath = rootPath.SetIndexesOfPathArray(['*']);
                                }
                                rootData = rootPath.eval(data);
                            }
                            else {
                                rootData = [data];
                            }
                        };
                        var createDefaultNode = function(id, label, group, shape){
                            var node = {};
                            node.id = id;
                            node.label = label;
                            node.value = 0;
                            node.group = group;
                            if(shape) {
                                node.shape = shape;
                            }

                            return node;
                        };
                        var createNodesWithIdentifier = function(identifier, isReference){
                            var newNodes = [];
                            var existingNodes =[];
                            var mappingRule = identifier.getMappingRule();
                            var domain = mappingRule.getDomain();
                            var range= mappingRule.getRange();
                            var rangeProp = range.Name;
                            var domainProp = domain.Name;
                            initRoot(domain);

                            var clusterFlag =false;
                            if(rootData.length > NETWORK.CLUSTER.SIZE) {
                                _clusters.push(className + '#' + clusterId);
                                clusterFlag = true;
                            }

                            var clusterCounter = 0;
                            for(var i=0;i<rootData.length;i++) {
                                var obj = rootData[i];
                                var id = className  + '/' + _.camelCase(obj[domainProp]);
                                if(!that.lookupKey(id)) {
                                    var node;
                                    if(isReference) {
                                        node = createDefaultNode(id, obj[domainProp], className, 'square');
                                    }
                                    else {
                                        node = createDefaultNode(id, obj[domainProp], className);
                                    }

                                    if(clusterFlag) {
                                        node.cluster = className + '#' + clusterId;
                                        clusterCounter++;
                                        if (clusterCounter % NETWORK.CLUSTER.SIZE === 0) {
                                            clusterId++;
                                            clusterCounter = 0;
                                            _clusters.push(className + '#' + clusterId);
                                        }
                                    }

                                    node[rangeProp] = obj[domainProp];
                                    that.addNodeKey(id, i+offset);

                                    newNodes.push(node);
                                }else {
                                    existingNodes.push(id);
                                }

                                _originMap[id] = rootPath.SetIndexesOfPathArray([i]).Path;
                            }
                            _clusters.push(className + '#' + clusterId);

                            return {new: newNodes, existing: existingNodes};
                        };
                        var createNodesWithoutIdentifier = function(mappingRule){
                            var nodes = [];
                            var domain = mappingRule.getDomain();

                            initRoot(domain);

                            var clusterCounter = 0;
                            var clusterFlag =false;
                            if(rootData.length > NETWORK.CLUSTER.SIZE) {
                                _clusters.push(className + '#' + clusterId);
                                clusterFlag = true;
                            }


                            for(var i=0;i<rootData.length;i++) {
                                var obj = rootData[i];
                                var id = className  + '/' + Guid();

                                var node = createDefaultNode(id, obj[domain.Name], className);

                                if(clusterFlag) {
                                    node.cluster = className + '#' + clusterId;
                                    clusterCounter++;
                                    if (clusterCounter % NETWORK.CLUSTER.SIZE === 0) {
                                        clusterId++;
                                        clusterCounter = 0;
                                        _clusters.push(className + '#' + clusterId);
                                    }
                                }

                                that.addNodeKey(id, i+offset);
                                _originMap[id] = rootPath.SetIndexesOfPathArray([i]).Path;
                                nodes.push(node);
                            }
                            _clusters.push(className + '#' + clusterId);
                            return nodes;
                        };



                        var newNodes, nodes, mappingRules;
                        if(identifier && identifier.getMappingRule()) {
                            nodes = createNodesWithIdentifier(identifier, nodeClass.isReference());
                            mappingRules = _.omit(nodeClass.getAllMappingRules(), identifier.getMappingRule().getId());
                            newNodes = nodes.new;
                        }
                        else{
                            mappingRules = nodeClass.getAllMappingRules();
                            var mappingRule = mappingRules[_.keys(mappingRules)[0]];
                            newNodes = createNodesWithoutIdentifier(mappingRule);
                            nodes = {new: newNodes};
                            mappingRules = _.omit(nodeClass.getAllMappingRules(), mappingRule.getId());
                        }

                        if(newNodes.length === rootData.length) {
                            _.forOwn(mappingRules, function (mappingRule) {
                                var domain = mappingRule.getDomain();
                                var range = mappingRule.getRange();
                                var rangeProp = range.Name;
                                var domainProp = domain.Name;

                                for (var i = 0; i < rootData.length; i++) {
                                    var obj = rootData[i];
                                    newNodes[i][rangeProp] = obj[domainProp];
                                }
                            });
                        }
                        return nodes;
                    };

                    var nodeClasses = mapping.getNodeClasses();
                    _.forOwn(nodeClasses, function(value, key){
                        var nodes =  createVertices(nodeClasses[key]);
                        _instanceMap[key] = _.union(_.pluck(nodes.new, 'id'), nodes.existing);
                        offset += nodes.length;
                        _nodes.add(nodes.new);
                    });

                    var edgeClasses = mapping.getEdgeClasses();
                    for (var edgeKey in edgeClasses){
                        if(edgeClasses.hasOwnProperty(edgeKey)) {
                            var edgeClass = edgeClasses[edgeKey];
                            var source = edgeClass.getSource();
                            var target = edgeClass.getTarget();

                            var sourceNodes = _nodes.get(_instanceMap[source.getId()]);
                            var targetNodes = _nodes.get(_instanceMap[target.getId()]);


                            for (var i = 0; i < sourceNodes.length; i++) {
                                var srcNode = sourceNodes[i];
                                var srcPath = _originMap[srcNode.id];
                                for (var j = 0; j < targetNodes.length; j++) {
                                    var targetNode = targetNodes[j];
                                    var targetPath = _originMap[targetNode.id];
                                    if(srcPath.indexOf(targetPath) > -1 || targetPath.indexOf(srcPath) > -1) {
                                        var edge = {};
                                        edge.from = srcNode.id;
                                        //edge.group = targetNodes[j].group;
                                        _nodes.update({id: srcNode.id, value: srcNode.value++});
                                       srcNode.value++;
                                        edge.to = targetNode.id;
                                        edge.arrows = 'to';
                                        edge.title = edgeClass.Name;
                                        _edges.add(edge);
                                    }
                                }
                            }
                        }
                    }
                },
                initNetwork : function(){
                    _network = new NetworkVis(_nodes, _edges, _clusters);
                },
                getNetwork: function(){
                    return _network;
                },
                addNodeKey: function(key, value){
                    if(!this.lookupKey(key)) {
                        _keyMap[key] = value;
                        return true;
                    }
                    else {
                        return false;
                    }
                },
                lookupKey: function(key){
                    return _keyMap.hasOwnProperty(key);
                },
                getNodeById : function(id){
                    if(_keyMap.hasOwnProperty(id)) {
                        return _nodes[_keyMap[id]];
                    }
                    else {
                        return null;
                    }
                },
                clearNetwork: function(){
                    _network = null;
                    _keyMap = {};
                    _nodes = new vis.DataSet();
                    _edges = new vis.DataSet();
                }
            }
        }
        return new NetworkManager();
    });