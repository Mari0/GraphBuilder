define([
    'jquery',
    'lodash',
    'Global',
    'events/EdgeClassEvent',
    'events/MappingRuleEvent',
    'events/NodeClassEvent',
    'bootstrapWrapper/Alert',
    'text!tpl/navbar/graphSchemaCtrlElements.html',
    'vis',
    'bootstrapWrapper/TabWrapper'], /**@lends InitGraphSchema*/
	function ($, _,Global, EdgeClassEvent, MappingRuleEvent, NodeClassEvent, Alert, htmlGraphSchemaCtrlElements, vis, TabWrapper) {

	function InitGraphSchema() {	}

    InitGraphSchema.prototype.sourceId = null;
    InitGraphSchema.prototype.targetId = null;

    InitGraphSchema.prototype.domainId = null;
    InitGraphSchema.prototype.rangeId = null;

	/**loads the graph structure.
	 * the graph structure can be a json-representation of the vertex and edge classes or an RDF/OWL-Ontology
	 */
    InitGraphSchema.LoadOntology = function() {
		var fileInput = document.getElementById("upload");
		if (fileInput) {
			var file = fileInput.files[0];
			if (file) {
                var reader = new FileReader();
                if (file.name.search(/.json/) !== -1) {
					reader.readAsText(file, "UTF-8");

					reader.onload = function (evt) {
						Global.Ontology = JSON.parse(evt.target.result);
                        InitGraphSchema.LoadJsonOntology();

					};

					reader.onerror = function () {
						Global.Ontology = 'error reading file';
					};
				} else {
                    alert("Not a JSON file");
                }
			}
		}
	};
    InitGraphSchema.LoadJsonOntology = function (supressAlert) {

        $('#OntologyControlElements').remove();
        var $ontoCtrlBody = $('#OntologyCtrl').find('.panel-body');
        $ontoCtrlBody.find('h4').remove();
        $ontoCtrlBody.append($(htmlGraphSchemaCtrlElements));

        //ontology panel
        $ontoCtrlBody.find('#lblGraphSchemaName').append(
            $(document.createElement('h4'))
                .append($('<strong>').text(Global.Ontology.name + ':')));


        var $vertexClassDropDownMenu = $ontoCtrlBody.find('#vertexClassSelector');
        for (var key in Global.Ontology.vertex_classes) {
            if (Global.Ontology.vertex_classes.hasOwnProperty(key)) {
                $vertexClassDropDownMenu.append($(document.createElement('option'))
                    .attr('value', key)
                    .text(key));
            }
        }

        /**
         * adds a node class to the svg canvas
         */
        $ontoCtrlBody.find('#addVertexClassButton').click(function () {
            var className = $('#vertexClassSelector').find('option:selected').text();
            NodeClassEvent.CreateNodeClassEvent(className, 400, 0);
        });

        var $edgeClassDropDownMenu = $ontoCtrlBody.find('#edgeClassSelector');
        for (var key2 in Global.Ontology.edge_classes) {
            if (Global.Ontology.edge_classes.hasOwnProperty(key2)) {
                var option = $(document.createElement('option'))
                    .attr('value', key2)
                    .text(key2);
                $edgeClassDropDownMenu.append(option);
            }
        }

        $ontoCtrlBody.find('#addEdgeClassButton').click(function () {
            var className = $('#edgeClassSelector').find('option:selected').text();
            EdgeClassEvent.EdgeCreateEvent(className);
        });

	    $ontoCtrlBody.find('#addTranslationPath').click(function () {
            MappingRuleEvent.MappingRuleCreateEvent();
        });

        $ontoCtrlBody.find('#btnVisualizeGraphSchema').click(function(){
            var network = {nodes:[], edges:[]};
            var keyStore  = {};
            _.forOwn(Global.Ontology.vertex_classes, function(value, key){
                var classNode = {};
                classNode.id = key;
                classNode.label = key;
                network.nodes.push(classNode);
                _.forOwn(Global.Ontology.vertex_classes[key].properties, function(v, propName){

                    if(!keyStore.hasOwnProperty(propName)) {
                        var propNode = {};
                        keyStore[propName] = true;
                        propNode.id = propName;
                        propNode.label = propName;
                        propNode.color = 'rgb(255,168,7)';
                        network.nodes.push(propNode);
                    }
                    var propEdge = {};
                    propEdge.from = key;
                    propEdge.to =  propName;
                    propEdge.color = 'rgb(255,168,7)';
                    network.edges.push(propEdge);
                });

                var superClass = Global.Ontology.vertex_classes[key].super_class;
                if(superClass){
                    var superClassEdge = {};
                    superClassEdge.from = key;
                    superClassEdge.to = superClass;
                    superClassEdge.arrows = 'to';
                    superClassEdge.color = 'red';
                    superClassEdge.label = 'isSubClassOf';
                    superClassEdge.font = {align: 'middle'};
                    network.edges.push(superClassEdge);
                }

            });

            _.forOwn(Global.Ontology.edge_classes, function(value, key){
                var edge = Global.Ontology.edge_classes[key];
                var edgeNode = {};
                edgeNode.id = key;
                edgeNode.label = key;
                edgeNode.shape = 'diamond';
                edgeNode.color = '#7BE141';
                network.nodes.push(edgeNode);

                if(edge.hasOwnProperty('from') && edge.hasOwnProperty('to')) {
                    var toEdge = {};
                    toEdge.from = key;
                    toEdge.to = edge.to.classname;
                    toEdge.arrows = 'to';
                    toEdge.font = {align: 'middle'};
                    toEdge.color = 'lime';

                    network.edges.push(toEdge);

                    var fromEdge = {};
                    fromEdge.from = edge.from.classname;
                    fromEdge.to = key;
                    fromEdge.arrows = 'to';
                    fromEdge.font = {align: 'middle'};
                    fromEdge.color = 'lime';
                    network.edges.push(fromEdge);
                }
                _.forOwn(Global.Ontology.edge_classes[key].properties, function(v, propName){

                    if(!keyStore.hasOwnProperty(propName)) {
                        var propNode = {};
                        keyStore[propName] = true;
                        propNode.id = propName;
                        propNode.label = propName;
                        propNode.color = 'rgb(255,168,7)';
                        network.nodes.push(propNode);
                    }
                    var propEdge = {};
                    propEdge.from = key;
                    propEdge.to =  propName;
                    propEdge.color = 'rgb(255,168,7)';
                    network.edges.push(propEdge);
                });

            });

            // create an array with nodes
            var nodes = new vis.DataSet(network.nodes);

            var edges = new vis.DataSet(network.edges);

            // create a network
            var container = $('<div></div>')[0];
            var networkData = {
                nodes: nodes,
                edges : edges
            };
            var options = {
                nodes: {borderWidth: 2},
                interaction: {hover: true},
                physics: {
                    forceAtlas2Based: {
                        gravitationalConstant: -26,
                        centralGravity: 0.005,
                        springLength: 230,
                        springConstant: 0.18
                    },
                    maxVelocity: 146,
                    solver: 'forceAtlas2Based',
                    timestep: 0.35,
                    stabilization: {iterations: 300}
                }
            };
            TabWrapper.AddCloseableTab(Global.Ontology.name, container);
            new vis.Network(container, networkData, options);

        });

		if (!supressAlert) {
            Alert.Success('Ontology successfully loaded!', '#inputCtrl .panel-body');
        }
		//InitCustomDatatypes(Global.Ontology);

	};


    return InitGraphSchema;
});
