define(['panels/NodePanel',
        'panels/EdgePanel',
        'bootstrapWrapper/TabWrapper',
        'vis'],
    /**@lends NetworkVis*/ function( NodePanel, EdgePanel, TabWrapper, vis){
        /**
         * Initializes the network
         * @param {vis.DataSet} nodes
         * @param {vis.DataSet} edges
         * @constructor
         */
        function NetworkVis(nodes, edges, clusters){

            // create a network
            var container = $('<div></div>')[0];
            var networkData = {

                nodes: nodes,
                edges: edges
            };
            var options = {
                nodes: {
                    shape: 'dot',
                    scaling: {
                        min: 10,
                        max: 30,
                        label: {
                            min: 8,
                            max: 30,
                            drawThreshold: 12,
                            maxVisible: 20
                        }
                    },
                    font: {
                        size: 12,
                        face: 'Tahoma'
                    }
                },
                edges: {
                    width: 0.15,
                    color: {inherit: 'from'},
                    smooth: {
                        type: 'continuous'
                    }
                },
                physics: true,
                interaction: {
                    tooltipDelay: 200,
                    hideEdgesOnDrag: true
                }
            };
            TabWrapper.AddCloseableTab('Network', container, true);

            var network = new vis.Network(container, networkData, options);

            this.getVisNetwork = function () {
                return network;
            };

            network.on('click', function(params){
                //the 'selectNode'-event also fires a 'selectEdge' event, therefore we use 'click' instead and this ugly work around
                if(params.nodes.length > 0) {
                    if (this.isCluster(params.nodes[0])) {
                        this.openCluster(params.nodes[0]);
                    }
                    else {
                        var node = this.body.data.nodes._data[params.nodes[0]];
                        new NodePanel(node);
                    }
                }
                else if(params.edges.length >0){
                    var edge =  this.body.data.edges._data[params.edges[0]];
                    new EdgePanel(edge);
                }
            });

            for(var i=0; i<clusters.length; i++) {
                this.clusterById(clusters[i]);
            }

        }

        NetworkVis.prototype.clusterById = function(id){
            var network = this.getVisNetwork();
            var nodeColor = null;
            var color = network.groups.groups[id.replace(/#\w*/g, '')].color.background;
            var  clusterOptionsByData = {
                joinCondition: function (childOptions) {
                    nodeColor = childOptions.color.background;
                    return childOptions.cluster === id;
                },
                processProperties: function (clusterOptions, childNodes) {
                    clusterOptions.label = childNodes.length;
                    clusterOptions.mass = 10;
                    return clusterOptions;
                },
                clusterNodeProperties: {
                    borderWidth: 3,
                    shape: 'database',
                    color: color
                }
            };
            network.cluster(clusterOptionsByData);
        };

        return NetworkVis;

    });