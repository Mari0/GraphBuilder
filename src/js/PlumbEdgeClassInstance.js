define(['jquery', 'lodash', 'Global', 'jsPlumb'], function($, _, Global) {
    /**
     * Get a JsPlumbInstance for a container.
     * Call this if the container div is available in DOM via id
     * @param containerId
     * @constructor
     */
    function GetPlumbInstance(containerId) {
        return jsPlumb.getInstance({
            Endpoint: ['Dot', {
                radius: 2
            }],
            Connector: ['StateMachine', {
                curviness: 10
            }],
            HoverPaintStyle: {
                strokeStyle: '#1e8151',
                lineWidth: 2
            },
            ConnectionOverlays: [
                ['Arrow', {
                    location: 1,
                    id: 'arrow',
                    length: 14,
                    foldback: 0.8
                }],
                //[ "Label", { label: "EDGE TYPE", id: "label", cssClass: "aLabel" }],
                ['Custom', {
                    create: function(/*component*/) {
                        var edgeTypeArray = [];
                        for (var key in Global.Ontology.edge_classes) {
                            if (Global.Ontology.edge_classes.hasOwnProperty(key)) {
                                edgeTypeArray.push(key);
                            }
                        }
                        var compiled = _.template('<% _.forEach(edgeTypes, function(edgeType) { %><option value="<%- edgeType %>"><%- edgeType %></option><% }); %>');
                        return $('<select id="edgeTypes">' + compiled({
                            'edgeTypes': edgeTypeArray
                        }) + '</select>');
                    },
                    location: 0.5,
                    id: 'edgeTypeList'
                }]
            ],
            Container: $(containerId)[0]

        });
    }
    return GetPlumbInstance;
});