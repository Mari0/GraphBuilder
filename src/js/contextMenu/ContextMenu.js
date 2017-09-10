define(['jquery',
    'lodash',
    'Global',
    'contextMenu/EditMenu',
    'contextMenu/VisibilityMenu',
    'contextMenu/DeleteMenu',
    'MappingManager',
    'events/NodeClassEvent',
    'events/EdgeClassEvent',
    'events/MappingRuleEvent',
    'jquery-contextmenu'],
    /**@lends ContextMenu*/
    function ($, _, Global, EditMenu, VisibilityMenu, DeleteMenu, MappingManager, NodeClassEvent, EdgeClassEvent, MappingRuleEvent) {

        //$(function(){}) shorthand for $(document).ready(function() { ... });
        $(function () {
            var InitClassList = function (vertex) {
                var classList = null;
                if (vertex) {
                    classList = 'vertex_classes';
                }
                else {
                    classList = 'edge_classes';
                }

                var list = {};
                if (!Global.Ontology) {
                    return;
                }
                for (var key in Global.Ontology[classList]) {
                    if (Global.Ontology[classList].hasOwnProperty(key)) {
                        list[key] = {
                            name: key
                        };
                    }
                }
                return list;
            };

            var event = null;
            var deleteList = ['JsonProperty', 'JsonArray', 'JsonObject', 'NodeClass', 'EdgeClass', 'MappingRule', 'ClassProperty'];

            var callbackFunction = function (key) {
                var canvas = MappingManager.getMappingCanvasById(Global.CurrentTabId);
                var $nodeClass;

                switch (key) {
                    case 'HideClass': {
                        $nodeClass = $(event.target).parents('.NodeClass');
                        if ($nodeClass.is('.NodeClass')) {
                            canvas.getNodeClassById($nodeClass.attr('id')).setPropertiesVisibility('hide');
                        }
                        else {
                            $(Global.CurrentTabId).find('.ClassProperty').hide();
                            $(Global.CurrentTabId).find('.MappingRule').hide();
                        }
                        break;
                    }
                    case 'HideMR': {
                        $nodeClass = $(event.target).parents('.NodeClass');
                        if ($nodeClass.length > 0) {
                            canvas.getNodeClassById($nodeClass.attr('id')).setMappingRulesVisibility('hide');
                        }
                        else {
                            $(Global.CurrentTabId).find('.MappingRule').hide();
                        }
                        break;
                    }
                    case 'HideEdgesBoth': {
                        $nodeClass = $(event.target).parents('.NodeClass');
                        if ($nodeClass.length > 0) {
                            canvas.getNodeClassById($nodeClass.attr('id')).setVisibilityOfEdges('hide');
                        }
                        else {
                            $(Global.CurrentTabId).find('.EdgeClass').hide();
                        }
                        break;
                    }
                    case 'HideEdgesIn': {
                        $nodeClass = $(event.target).parents('.NodeClass');
                        if ($nodeClass.length > 0) {
                            $nodeClass = $(event.target).parents('.NodeClass');
                            canvas.getNodeClassById($nodeClass.attr('id')).setVisibilityOfEdges('hide', 'in');
                        }
                        else {
                            $(Global.CurrentTabId).find('.EdgeClass').hide();
                        }
                        break;
                    }
                    case 'HideEdgesOut': {
                        $nodeClass = $(event.target).parents('.NodeClass');
                        if ($nodeClass.length > 0) {
                            $nodeClass = $(event.target).parents('.NodeClass');
                            canvas.getNodeClassById($nodeClass.attr('id')).setVisibilityOfEdges('hide', 'out');
                        }
                        else {
                            $(Global.CurrentTabId).find('.EdgeClass').hide();
                        }
                        break;
                    }
                    case 'ShowClass': {
                        $nodeClass = $(event.target).parents('.NodeClass');
                        if ($nodeClass.length > 0) {
                            canvas.getNodeClassById($nodeClass.attr('id')).setPropertiesVisibility('show');
                        } else {
                            $(Global.CurrentTabId).find('.ClassProperty').show();
                        }
                        break;
                    }
                    case "ShowMR": {
                        $nodeClass = $(event.target).parents('.NodeClass');
                        if ($nodeClass.length > 0) {
                            canvas.getNodeClassById($nodeClass.attr('id')).setMappingRulesVisibility('show');
                        }
                        else {
                            $(Global.CurrentTabId).find('.MappingRule').show();
                        }
                        break;
                    }
                    case "ShowEdgesBoth": {
                        $nodeClass = $(event.target).parents('.NodeClass');
                        if ($nodeClass.length > 0) {
                            canvas.getNodeClassById($nodeClass.attr('id')).setVisibilityOfEdges('show');
                        }
                        else {
                            $(Global.CurrentTabId).find('.EdgeClass').show();
                        }
                        break;
                    }
                    case "ShowEdgesIn": {
                        $nodeClass = $(event.target).parents('.NodeClass');
                        if ($nodeClass.length > 0) {
                            $nodeClass = $(event.target).parents('.NodeClass');
                            canvas.getNodeClassById($nodeClass.attr('id')).setVisibilityOfEdges('show', 'in');
                        }
                        else {
                            $(Global.CurrentTabId).find('.EdgeClass').show();
                        }
                        break;
                    }
                    case "ShowEdgesOut": {
                        $nodeClass = $(event.target).parents('.NodeClass');
                        if ($nodeClass.length > 0) {
                            $nodeClass = $(event.target).parents('.NodeClass');
                            canvas.getNodeClassById($nodeClass.attr('id')).setVisibilityOfEdges('show', 'out');
                        }
                        else {
                            $(Global.CurrentTabId).find('.EdgeClass').show();
                        }
                        break;
                    }
                    case "delete": {
                        var deleteHelper = function ($node) {
                            if (!$node.is('svg')) {
                                var className = $node.attr('class');
                                if (_.contains(deleteList, className)) {
                                    return $node;
                                }
                                else {
                                    return deleteHelper($node.parent());
                                }
                            }
                        };
                        var $node = $(event.target);
                        $node = deleteHelper($node);
                        switch ($node.attr('class')) {
                            case 'NodeClass': {
                                canvas.deleteNodeClassById($node.attr('id'));
                                break;
                            }
                            case 'ClassProperty': {
                                var propId = $node.attr('id');
                                var classId = $node.parents('.NodeClass').attr('id');

                                var nodeClass = canvas.getNodeClassById(classId);
                                nodeClass.deletePropertyById(propId);
                                break;
                            }
                        }
                        break;
                    }
                    case 'truncateClass': {
                        $nodeClass = $(event.target).parents('.NodeClass');
                        var nodeClass2 = canvas.getNodeClassById($nodeClass.attr('id'));
                        var properties = nodeClass2.getProperties();
                        for (var propKey in properties) {
                            if (properties.hasOwnProperty(propKey) && properties[propKey].getMappingRule() == null) {
                                nodeClass2.deletePropertyById(propKey);
                            }
                        }
                        break;
                    }
                    default: {
                        if (Global.Ontology) {
                            if ($.inArray(key, Object.keys(Global.Ontology.edge_classes)) !== -1) {
                                EdgeClassEvent.EdgeCreateEvent(key);
                            }
                            if ($.inArray(key, Object.keys(Global.Ontology.vertex_classes)) !== -1) {
                                var offset = Global.GetOffsetCoordinates(event);
                                NodeClassEvent.CreateNodeClassEvent(key, offset.x, offset.y);
                            }
                            break;
                        }
                    }
                }
            };

            $.contextMenu({
                selector: '.context-menu-one',
                build: function ($trigger, e) {
                    EditMenu.NodeClasses.items = InitClassList(true);
                    event = e;
                    var $target = $(e.target);
                    var contextMenu = null;

                    if ($target.is('.mappingcanvas')) {
                        contextMenu = _.assign(_.clone(EditMenu), { sep: '---' }, VisibilityMenu);
                    }
                    else if ($target.parent().parent().is('.NodeClass') || $target.parent().parent().is('.ClassProperty')) {
                        contextMenu = _.assign(_.clone(VisibilityMenu), { sep: '---' }, DeleteMenu);
                    }
                    else {
                        contextMenu = { Quit: { name: 'Quit', icon: 'delete' } };
                    }

                    return {
                        callback: callbackFunction,
                        items: contextMenu
                    };
                }
            });

        });
    });
