/**
 * Created by mario on 01.07.2015.
 */
define([
    'entities/range/AbstractClass',
    'entities/range/NodeClass',
    'svg/SvgEdge',
    'util/TransformCoordinates'
    ],function (AbstractClass, NodeClass, svgEdge,GetTransformCoords) {

    EdgeClass.prototype = new AbstractClass();
    EdgeClass.prototype.constructor = EdgeClass;
    EdgeClass.TYPE = 'EdgeClass';

    /**
     * This class represents the edge class of a graph schema in the mapping config
     * @param {string} id the identifier of the edge
     * @param {string} name the name of the class
     * @param {object} src the NodeClass-object representing the source
     * @param {object} target the NodeClass-object representing the target
     * @returns {Error} if the src and target are not valid NodeClass objects
     * @constructor
     */
    function EdgeClass(id,name, src, target){
        var that = this;

        AbstractClass.call(this, id, name);
        if(!(src instanceof  NodeClass)) {
            return new Error('source is not a NodeClass');
        }

        /**
         *  the source of the edge as a NodeClass
         * @type {object}
         * @see range/NodeClass
         * @private
         */
        var _src = src;

        if(!(target instanceof NodeClass)) {
            return new Error('target is not a NodeClass');
        }
        /**
         * the target of the edge as a NodeClass
         * @type {Object}
         * @private
         */
        var _target = target;



        src.addOutgoingEdge(this);
        target.addIngoingEdge(this);

        var srcTransform = GetTransformCoords(src.get$node());
        var srcX = src.X + srcTransform.x;


        var destTransform = GetTransformCoords(target.get$node());
        var destX = target.X + destTransform.x /*- 12*/;

        var left_left = (destX - srcX) < 0 ? (destX - srcX) * (-1) : (destX - srcX);
        var right_left = (destX - (srcX + src.getWidth())) < 0 ? (-1) * (destX - (srcX + src.getWidth())) : (destX - (srcX + src.getWidth()));
        var left_right = ((destX + target.getWidth()) - srcX) < 0 ? ((destX + target.getWidth()) - srcX) * (-1) : ((destX + target.getWidth()) - srcX);

        if (left_left > left_right) {
            destX += target.getWidth();
        }
        else if (left_left > right_left) {
            srcX += src.getWidth();
        }
        else {
            destX += target.getWidth();
            srcX += src.getWidth();
        }
        var destY = target.Y + (target.getHeight()) / 2 + destTransform.y;
        var srcY = src.Y + (src.getHeight() / 2) + srcTransform.y;

        /**
         * Get the source-NodeClass of the EdgeClass
         * @returns {Object}
         */
        this.getSource = function(){
            return _src;
        };

        /**
         * Get the target-NodeClass of the EdgeClass
         * @returns {Object}
         */
        this.getTarget = function(){
            return _target;
        };

        /**
         * generate the svg element
         */
        this.generateSvg = function(){
            var $node = svgEdge(id, EdgeClass.TYPE, name, srcX, srcY, destX, destY, that.OFFSETX, that.OFFSETY);
            this.set$node($node);
        };
    }

    EdgeClass.prototype.toJSON = function(){
        var json = AbstractClass.prototype.toJSON.call(this);
        json.source = this.getSource().getId();
        json.target = this.getTarget().getId();
        return json;
    };

    /**
     * generate the svg element
     * @see generateSvg
     */
    EdgeClass.prototype.generateSvgEntity = function(){
        this.generateSvg();
    };
    return EdgeClass;
});
