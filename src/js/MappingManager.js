define(['Global',
        'entities/domain/JsonObject',
        'entities/domain/JsonArray',
        'entities/domain/JsonProperty',
        'entities/MappingCanvas',
        'util/DragAndDrop',
        'bootstrapWrapper/TabWrapper'], /**@lends MappingManager*/
    function ( Global, JObject, JArray, JProperty, MappingCanvas, DragNDrop,TabWrapper) {

    /**
     * the entity manager
     * @returns {object}
     * @constructor
     */
    function MappingManager(){
        var _configs = {};
        var _domainEntry = null;

        /**
         *  private helper function for generateDomain
         */
        function helper(root, data, id, depth) {
            var d = depth + 1;
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var val = data[key];
                    _domainEntry.meta.numberOfEntities++;
                    var x = Global.Config.DOMAIN.X + Global.Config.DOMAIN.OFFSET * d;
                    var y = Global.Config.DOMAIN.Y + _domainEntry.meta.numberOfEntities * Global.Config.DOMAIN.HEIGHT;
                    if ((x + Global.Config.DOMAIN.WIDTH) > _domainEntry.meta.maxWidth) {
                        _domainEntry.meta.maxWidth = (x + Global.Config.DOMAIN.WIDTH);
                    }
                    _domainEntry.meta.maxHeight = y;
                    var gId = null;
                    var node = null;
                    if (Object.prototype.toString.call(val) === "[object Array]") {
                        gId = id + '.' + key + '[0]';
                        if (val.length > 0 && typeof val[0] === 'object' || typeof val[0] === 'array') {
                            node = new JArray(gId, '[]' + key, x, y, Global.Config.DOMAIN.WIDTH, Global.Config.DOMAIN.HEIGHT);
                            node.generateSvgEntity();
                            helper(node, val[0], gId, d);
                            root.add(node);
                        } else {
                            node = new JArray(gId, '[]' + key, x, y, Global.Config.DOMAIN.WIDTH, Global.Config.DOMAIN.HEIGHT, val[0], typeof val[0]);
                            node.generateSvgEntity();
                            root.add(node);
                        }
                    } else if (typeof val === "object") {
                        gId = id + '.' + key;
                        node = new JObject(gId, '{}' + key, x, y, Global.Config.DOMAIN.WIDTH, Global.Config.DOMAIN.HEIGHT);
                        node.generateSvgEntity();
                        helper(node, val, gId, d);
                        root.add(node);
                    } else {
                        var type = null;
                        if (val === null) {
                            type = 'undefined';
                        }
                        else {
                            type = typeof val;
                        }

                        //Cut the example value down to max 100 characters
                        if (val.length > 100) {
                            val = val.substring(0, 100) + '...';
                        }

                        gId = id + '.' + key;
                        node = new JProperty(gId, key, x, y, Global.Config.DOMAIN.WIDTH, Global.Config.DOMAIN.HEIGHT, val, type);
                        node.generateSvgEntity();
                        root.add(node);
                    }
                }
            }
            return root;
        }
        function DragAndDropInit(canvas){
            //Drag And Drop Init
            DragNDrop.SVGRoot = canvas.get$node()[0];
            DragNDrop.TrueCoords = DragNDrop.SVGRoot.createSVGPoint();
            DragNDrop.GrabPoint = DragNDrop.SVGRoot.createSVGPoint();
        }
        function addMapping(mappingCanvas){
            var tabId =  mappingCanvas.getTabId();
            if(tabId && !_configs.hasOwnProperty(tabId) && mappingCanvas instanceof MappingCanvas ){
                _configs[tabId] = mappingCanvas;
            }

        }
        function registerMapping(label, canvas){
            //Create Tab for the mapping
            TabWrapper.AddCloseableTab(label, canvas.get$node());
            canvas.setTabId(Global.CurrentTabId);
            addMapping(canvas);
        }



        return {
            generateDomain: function(json){
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
                _domainEntry.data = helper(root, json, '$', 0);
                return _domainEntry;
            },
            getConfigs:function(){
                return _configs;
            },
            getMappingCanvasById : function(id){
                if(_configs.hasOwnProperty(id)) {
                    return _configs[id];
                }
                else {
                    return null;
                }
            },
            createMappingCanvasFromExample : function(id, json){
                if (json.constructor.name === 'Array') {
                    json = json[0];
                }
                var domain = this.generateDomain(json);
                var canvas = new MappingCanvas(id, '100%', domain.meta.maxHeight + 200);
                canvas.setDomain(domain.data);

                DragAndDropInit(canvas);
                registerMapping(id, canvas);
                return canvas;
            },
            createMappingCanvasFromJSON :function(id,json){
                var canvas = MappingCanvas.CreateMappingFromJSON(json);

                DragAndDropInit(canvas);
                registerMapping(id, canvas);
                return canvas;
            },
            getCurrentMappingCanvas : function(){
                return this.getMappingCanvasById(Global.CurrentTabId);
            },
            visualizeMappingCanvas : function(name,mapping){
                mapping.generateSvg();
                registerMapping(name, mapping);
                DragAndDropInit(mapping);
            },
            removeCurrentMappingCanvas : function () {
                var mapping = this.getCurrentMappingCanvas();
                delete _configs[mapping.getTabId()];
                TabWrapper.removeCurrentTab();
            },
            removeMappingById : function (id) {
                if(_configs.hasOwnProperty(id)) {
                    delete _configs[id];
                }
            },
            doesMappingExists: function(id){
                return _configs.hasOwnProperty(id);
            }

        };
    }
    return new MappingManager();
});