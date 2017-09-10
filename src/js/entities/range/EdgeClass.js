/**
 * Created by mario on 01.07.2015.
 */
define([
    'jsPlumb',
    'entities/range/AbstractClass',
    'entities/range/NodeClass'
], function (jsPlumb, AbstractClass, NodeClass) {

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
    function EdgeClass(id, name, src, target) {
        AbstractClass.call(this, id, name);
        if (!(src instanceof NodeClass)) {
            return new Error('source is not a NodeClass');
        }

        /**
         *  the source of the edge as a NodeClass
         * @type {object}
         * @see range/NodeClass
         * @private
         */
        var _src = src;

        if (!(target instanceof NodeClass)) {
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

        /**
         * Get the source-NodeClass of the EdgeClass
         * @returns {Object}
         */
        this.getSource = function () {
            return _src;
        };

        /**
         * Get the target-NodeClass of the EdgeClass
         * @returns {Object}
         */
        this.getTarget = function () {
            return _target;
        };
    }

    EdgeClass.prototype.toJSON = function () {
        var json = AbstractClass.prototype.toJSON.call(this);
        json.source = this.getSource().getId();
        json.target = this.getTarget().getId();
        return json;
    };


    return EdgeClass;
});
