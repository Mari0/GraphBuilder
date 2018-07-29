define(['jquery'], /**@lends Global*/
    function($) {
        /**
         * A Global class to store Global variables and functions
         * @constructor
         */
        function Global() {}

        Global.URL = 'http://localhost:8888/';
        //Global.URL = 'http://mariorose.bitbucket.org/graphbuilder/';

        Global.Config = {
            NETWORK: {
                CLUSTER: {
                    SIZE: 50
                }
            },
            DOMAIN: {
                X: 10,
                Y: 75,
                WIDTH: 200,
                HEIGHT: 20,
                OFFSET: 5
            },
            TEST_MODE: false
        };

        Global.JsonPropertyConfig = {
            endpoint: 'Dot',
            anchor: ['Right'],
            paintStyle: {
                strokeStyle: '#00CCCC',
                fillStyle: 'transparent',
                radius: 7,
                lineWidth: 2
            },
            connectorStyle: {
                lineWidth: 2,
                strokeStyle: '#00CCCC',
                joinstyle: 'round',
                outlineColor: 'white',
                outlineWidth: 1
            },
            hoverPaintStyle: {
                strokeStyle: '#00CCCC',
                fillStyle: '#00CCCC'
            },
            connectorHoverStyle: {
                lineWidth: 6,
                strokeStyle: '#00CCCC'
            },
            dropOptions: {
                tolerance: 'touch',
                hoverClass: 'dropHoverMappingRule',
                activeClass: 'dragActive'
            }
        };

        Global.ClassPropertyConfig = {
            endpoint: 'Dot',
            anchor: ['Left'],
            paintStyle: {
                strokeStyle: '#00CCCC',
                fillStyle: 'transparent',
                radius: 7,
                lineWidth: 2
            },
            connectorStyle: {
                lineWidth: 2,
                strokeStyle: '#00CCCC',
                joinstyle: 'round',
                outlineColor: 'white',
                outlineWidth: 1
            },
            hoverPaintStyle: {
                strokeStyle: '#00CCCC',
                fillStyle: '#00CCCC'
            },
            connectorHoverStyle: {
                lineWidth: 5,
                strokeStyle: '#00CCCC'
            },
            dropOptions: {
                tolerance: 'touch',
                hoverClass: 'dropHoverMappingRule',
                activeClass: 'dragActive'
            }
        };

        /** Stores the ontology in a javascript object*/
        Global.Ontology = null;

        /** Contains all data types supported by MappingConfigurator.*/
        Global.Datatypes = null;

        /** The id of the current active tab*/
        Global.CurrentTabId = null;

        /** Determines if the user is creating a mapping rule or a edge class. this effects the cursor styles and click events*/
        Global.prototype.InEdgeCreationMode = false;

        /** Color of the hyper edge*/
        Global.HyperEdgeColor = '#00FFCC';

        /**
         * Converts a id of dom element to a jquery selector
         * @param {string} idName - the id name
         * @return {string}
         */
        Global.GetSelectorFromId = function(idName) {
            return '#' + idName.replace(/\#/g, '\\#').replace(/\$/g, '\\$').replace(/\./g, '\\.').replace(/\:/g, '\\:').replace(/\[/g, '\\[').replace(/\]/g, '\\]').replace(/\ /g, '\\ ');
        };

        Global.GetOffsetCoordinates = function(event) {
            var x,
                y;
            if (event.offsetX === undefined) {
                x = event.pageX - $(Global.CurrentTabId).offset().left;
                y = event.pageY - $(Global.CurrentTabId).offset().top;
            } else {
                x = event.offsetX;
                y = event.offsetY;
            }
            return {
                x: x,
                y: y
            };
        };
        return Global;
    });