define(['jquery',
		'MappingManager',
        'ProjectManager',
		'Global',
    	'bootstrapWrapper/TabWrapper',
		'util/InitGraphSchema',
		'navbar/NavBarMain',
		'contextMenu/ContextMenu'],
	function ($, MappingManager,ProjectManager, Global, TabWrapper, InitGraphSchema, MappingConfigNavigation) {

        function InitMappingConfigurator() {
            $.get(Global.URL + 'init.json', function (init) {
                if(!init) {
                    console.error('No init.json found');
                    return;
                }
                if (init.source) {
                    $.get(init.url + init.source, function (data) {
                        var dataSrc = null;
                        try {
                            dataSrc = JSON.parse(data);
                        } catch (e) {
                            dataSrc = data;
                        }
                        MappingManager.createMappingCanvasFromExample('Premapping',dataSrc);
                    }).fail(function (resp) {
                        alert(resp.responseText + ' No datasource example found!');
                    });
                }
                if (init.ontology) {
                    $.get(init.url + init.ontology, function (data) {
                        var onto = null;
                        try {
                            onto = JSON.parse(data);
                        } catch (e) {
                            onto = data;
                        }
                        Global.Ontology = onto;
                        InitGraphSchema.LoadJsonOntology();
                    }).fail(function (resp) {
                        alert(resp.responseText + ' No Ontology found!');
                    });
                }

                if(init.import){
                    $.get(init.url + init.import, function(data){
                        var mapping = null;
                        try {
                            mapping = JSON.parse(data);
                        } catch (e) {
                            mapping = data;
                        }
                        MappingManager.createMappingCanvasFromJSON('Import', mapping);
                    }).fail(function(){
                        console.log('No mapping found in init');
                    });
                }

                if(init.hasOwnProperty('project')){
                    $.get(init.url + init.project, function(data){
                        var mapping = null;
                        try {
                            mapping = JSON.parse(data);
                        } catch (e) {
                            mapping = data;
                        }
                        ProjectManager.fromJSON(mapping);
                    }).fail(function(){
                        console.log('No mapping found in init');
                    });
                }
            }).error(function (error) {
                console.error(error);
            });


        }

        $(document).ready(function () {
            MappingConfigNavigation();

            /*var keys = {};
		$('body').keydown(function (e) {
            keys[e.which] = true;
            keyboard(keys);
        }).keyup(function (e) {
            delete keys[e.which];
        });*/


            //InitMappingConfigurator();
            TabWrapper.InitTabContainer();
        });


        /*
	document.getElementsByAttribute = Element.prototype.getElementsByAttribute = function (attr, val) {
		var nodeList = this.getElementsByTagName('*');
		var nodeArray = [];
		for (var i = 0, elem; elem = nodeList[i]; i++) {
			switch (typeof val) {
			case "undefined":
				if (typeof elem.getAttribute(attr) != "undefined")
					nodeArray.push(elem);
				break;
			default:
				if (elem.getAttribute(attr) == val)
					nodeArray.push(elem);
				break;
			}
		}
		return nodeArray;
	};
	*/

    });
