define([
    'lodash',
    'entities/range/AbstractClass',
    'svg/SvgEntity'
    ], function (_,AbstractClass, svgEntity) {

    NodeClass.prototype = new AbstractClass();
    NodeClass.prototype.constructor = NodeClass;
    NodeClass.TYPE = 'NodeClass';
    NodeClass.DEFAULT_COLOR = '#191970';
    NodeClass.REFERENCE_COLOR = 'red';

    /**
     * the class represent a NodeClass of the Graph Schema
     * @param {string} id the identifier of the NodeClass
     * @param {string} name the name of the NodeClass
     * @param {int} x
     * @param {int} y
     * @param {int} width
     * @param {int} height
     * @constructor
     */
    function NodeClass(id, name, x,y, width, height){
        var that = this;

        AbstractClass.call(this,id, name);

        /**
         * the x-position in the svg
         * @type {Number}
         */
        this.X = x;

        /**
         * the y-position in the svg
         * @type {Number}
         */
        this.Y= y;


        var _identifier = null;


        var _referenceFlag = false;

        /**
         * a map of all outgoing edge classes
         * @type {object}
         * @private
         */
        var _outgoingEdges = {};

        /**
         * a map of all ingoing edge classes
         * @type {object}
         * @private
         */
        var _ingoingEdges = {};

        /**
         * the width
         * @type {Number}
         * @private
         */
        var _width = width;

        /**
         * the height
         * @type {Number}
         * @private
         */
        var _height = height;

        /**
         * Get the width of the svg element representing the ClassNode
         * @returns {Number}
         */
        this.getWidth = function(){
            return _width;
        };

        /**
         *Get the height of the svg element representing the ClassNode
         * @returns {Number}
         */
        this.getHeight = function(){
            return _height;
        };

        /**
         * Get the outgoing edges of the NodeClass
         * @returns {object}
         */
        this.getOutgoingEdges = function(){
            return _outgoingEdges;
        };

        /**
         * Get the ingoing edges
         * @returns {{}}
         */
        this.getIngoingEdges = function(){
            return _ingoingEdges;
        };

        /**
         * generate the svg element
         */
        this.generateSvg = function(){
            var $node = svgEntity(id, NodeClass.TYPE, name, x, y, width, height, NodeClass.DEFAULT_COLOR);
            if(_referenceFlag) {
                $node.children('rect').css('fill', NodeClass.REFERENCE_COLOR);
            }
            var $properties = $node.children('.properties');
            var properties = this.getProperties();

            for(var key in properties){
                if(properties.hasOwnProperty(key)){
                    var property = properties[key];
                    property.generateSvg();
                    $properties.append(property.get$node());
                }
            }

            this.set$node($node);

        };

        this.isReference = function() {
            return _referenceFlag;
        };

        this.enableReference = function(){
            _referenceFlag = true;
            var _$node = that.get$node();
            if(_$node){
                _$node.children('rect').css('fill', NodeClass.REFERENCE_COLOR);
            }
        };

        this.disableReference = function(){
            _referenceFlag = false;
            var _$node = that.get$node();
            if(_$node){
                _$node.children('rect').css('fill', NodeClass.DEFAULT_COLOR);
            }
        };

        this.getIdentifier = function(){
            return _identifier;
        };

        this.setIdentifier = function(id){
            _identifier = id;
        };
    }
    NodeClass.prototype.toJSON = function(){
        var json = AbstractClass.prototype.toJSON.call(this);
        json.x = this.X;
        json.y = this.Y;
        json.isReference = this.isReference();
        //json.width = this.getWidth();
        //json.height = this.getHeight();
        return json;
    };

    /**
     * adds a ingoing edgeclass to the node class
     * @param edge
     */
    NodeClass.prototype.addIngoingEdge = function(edge){
        var ingoingEdges = this.getIngoingEdges();
        if(!ingoingEdges.hasOwnProperty(edge.getId())){
            ingoingEdges[edge.getId()] = edge;
        }
    };

    /**
     * adds a outgoing edge to the node class
     * @param {object} edge the edge class
     */
    NodeClass.prototype.addOutgoingEdge = function(edge){
        var outgoingEdges = this.getOutgoingEdges();
        if(!outgoingEdges.hasOwnProperty(edge.getId())){
            outgoingEdges[edge.getId()] = edge;
        }
    };

    NodeClass.prototype.generateSvgEntity = function(){
        this.generateSvg();
    };

    NodeClass.prototype.getAllEdges = function(){
      return _.assign(this.getIngoingEdges(), this.getOutgoingEdges());
    };

    NodeClass.prototype.setVisibilityOfEdges = function(visibility, direction){
        var that = this;
        var setVisibilityOfEdgesHelper = function(fn, visibility){
            var edges = that[fn]();
            for(var key in edges){
                if(edges.hasOwnProperty(key)){
                    edges[key].get$node()[visibility]();
                }
            }
        };

        switch(direction){
            case 'in':{
                setVisibilityOfEdgesHelper('getIngoingEdges', visibility);
                break;
            }
            case 'out':{
                setVisibilityOfEdgesHelper('getOutgoingEdges', visibility);
                break;
            }
            default :{
                setVisibilityOfEdgesHelper('getAllEdges', visibility);
            }
        }
    };

    NodeClass.prototype.editName = function(name){
        this.Name = name;
        var $node = this.get$node();
        if($node) {
            $node.children('text').text(name);
        }

    };
    return NodeClass;
});