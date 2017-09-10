define(['Global',
        'lodash',
        'entities/domain/JsonObject',
        'entities/domain/JsonArray',
        'entities/domain/JsonProperty',
        'entities/MappingCanvas',
        'bootstrapWrapper/TabWrapper'
    ], /**@lends MappingManager*/
    function(Global, _, JObject, JArray, JProperty, MappingCanvas, TabWrapper) {

        /**
         * the entity manager
         * @returns {object}
         * @constructor
         */
        function MappingManager() {
            var _configs = {};
            var _domainEntry = null;

            var getDepthOfNode = function(node) {
                var depth = 0;
                var nodes = node.getElements();
                depth += _.keys(nodes).length;
                for (var key in nodes) {
                    if (nodes.hasOwnProperty(key)) {
                        var tmp = nodes[key];
                        if (tmp instanceof JObject || tmp instanceof JArray) {
                            depth += getDepthOfNode(tmp, depth);
                        }
                    }
                }
                return depth;

            };

            /**
             *  private helper function for generateDomain
             */
            function helper(root, data, id, depth, offset) {
                var d = depth + 1;
                var sibling = null;
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        var val = data[key];

                        _domainEntry.meta.numberOfEntities++;
                        var x = Global.Config.DOMAIN.X + Global.Config.DOMAIN.OFFSET * d;
                        //var y = Global.Config.DOMAIN.Y + _domainEntry.meta.numberOfEntities * Global.Config.DOMAIN.HEIGHT;

                        if ((x + Global.Config.DOMAIN.WIDTH) > _domainEntry.meta.maxWidth) {
                            _domainEntry.meta.maxWidth = (x + Global.Config.DOMAIN.WIDTH);
                        }
                        var gId = null;
                        var node = null;
                        if (Object.prototype.toString.call(val) === '[object Array]') {
                            gId = id + '.' + key + '[0]';
                            if (val.length > 0 && typeof val[0] === 'object' || typeof val[0] === Array) {

                                if (sibling) {
                                    offset += getDepthOfNode(sibling) * Global.Config.DOMAIN.HEIGHT;
                                    node = new JArray(gId, '[]' + key, x, offset);
                                } else
                                    node = new JArray(gId, '[]' + key, x, 0);

                                node.generateSvgEntity();

                                helper(node, val[0], gId, d, offset);
                                sibling = node;
                                root.add(node);
                            } else {
                                if (sibling) {
                                    offset += getDepthOfNode(sibling) * Global.Config.DOMAIN.HEIGHT;
                                    node = new JArray(gId, '[]' + key, x, offset, val[0], typeof val[0]);
                                } else
                                    node = new JArray(gId, '[]' + key, x, 0, val[0], typeof val[0]);
                                node.generateSvgEntity();
                                sibling = node;
                                root.add(node);
                            }
                        } else if (typeof val === 'object') {
                            gId = id + '.' + key;
                            if (sibling) {
                                offset += getDepthOfNode(sibling) * Global.Config.DOMAIN.HEIGHT;
                                node = new JObject(gId, '{}' + key, x, offset);
                            } else
                                node = new JObject(gId, '{}' + key, x, 0);

                            node.generateSvgEntity();
                            helper(node, val, gId, d, offset);
                            sibling = node;
                            root.add(node);
                        } else {
                            var type = null;
                            if (val === null) {
                                type = 'undefined';
                            } else {
                                type = typeof val;
                            }

                            //Cut the example value down to max 100 characters
                            if (val.length > 100) {
                                val = val.substring(0, 100) + '...';
                            }

                            gId = id + '.' + key;
                            if (sibling) {
                                offset += getDepthOfNode(sibling) * Global.Config.DOMAIN.HEIGHT;
                                node = new JObject(gId, '{}' + key, x, offset);
                            } else node = new JProperty(gId, key, x, 0, val, type);
                            node.generateSvgEntity();
                            if (node instanceof JArray || node instanceof JObject)
                                sibling = node;
                            root.add(node);
                        }
                    }
                }
                return root;
            }

            function addMapping(mappingCanvas) {
                var tabId = mappingCanvas.getTabId();
                if (tabId && !_configs.hasOwnProperty(tabId) && mappingCanvas instanceof MappingCanvas) {
                    _configs[tabId] = mappingCanvas;
                }

            }

            function registerMapping(label, canvas) {
                //Create Tab for the mapping
                TabWrapper.AddCloseableTab(label, canvas.get$node());
                canvas.setTabId(Global.CurrentTabId);
                canvas.initPlumbElements();
                addMapping(canvas);
            }
            return {
                generateDomain: function(json) {
                    _domainEntry = {
                        data: null,
                        meta: {
                            numberOfEntities: 0,
                            maxWidth: 0,
                            maxHeight: 0
                        }
                    };
                    var root = new JObject('$', 'root', Global.Config.DOMAIN.X, Global.Config.DOMAIN.Y, Global.Config.DOMAIN.WIDTH, Global.Config.DOMAIN.HEIGHT);
                    root.generateSvgEntity();
                    _domainEntry.data = helper(root, json, '$', 0, 0);
                    _domainEntry.meta.maxHeight = Global.Config.DOMAIN.Y + (Global.Config.DOMAIN.HEIGHT * _domainEntry.meta.numberOfEntities);
                    root.get$node().find('.attributes').css('height', _domainEntry.meta.maxHeight);
                    return _domainEntry;
                },
                getConfigs: function() {
                    return _configs;
                },
                getMappingCanvasById: function(id) {
                    if (_configs.hasOwnProperty(id)) {
                        return _configs[id];
                    } else {
                        return null;
                    }
                },
                createMappingCanvasFromExample: function(id, json) {
                    if (json.constructor.name === 'Array') {
                        json = json[0];
                    }
                    var domain = this.generateDomain(json);
                    var canvas = new MappingCanvas(id, '100%', domain.meta.maxHeight + 200);
                    canvas.setDomain(domain.data);

                    registerMapping(id, canvas);
                    return canvas;
                },
                createMappingCanvasFromJSON: function(id, json) {
                    var canvas = MappingCanvas.CreateMappingFromJSON(json);
                    registerMapping(id, canvas);
                    return canvas;
                },
                getCurrentMappingCanvas: function() {
                    return this.getMappingCanvasById(Global.CurrentTabId);
                },
                visualizeMappingCanvas: function(name, mapping) {
                    mapping.generateSvg();
                    registerMapping(name, mapping);
                },
                removeCurrentMappingCanvas: function() {
                    var mapping = this.getCurrentMappingCanvas();
                    delete _configs[mapping.getTabId()];
                    TabWrapper.removeCurrentTab();
                },
                removeMappingById: function(id) {
                    if (_configs.hasOwnProperty(id)) {
                        delete _configs[id];
                    }
                },
                doesMappingExists: function(id) {
                    return _configs.hasOwnProperty(id);
                }

            };
        }
        return new MappingManager();
    });