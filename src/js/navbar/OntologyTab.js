define(['jquery',
    //'Global',
    //'bootstrapWrapper/Alert',
    //'util/InitGraphSchema',
    //'jsonEditor',
    //'bootstrapWrapper/TabWrapper',
    'text!tpl/navbar/graphSchemaTab.html'
    ], /**@lends OntologyPanel */
	function ($, /*Global, Alert, InitGraphSchema, JSONEditor, TabWrapper,*/ htmlGraphSchemaTab) {

    OntologyPanel.Ontology = null;
    OntologyPanel.CollectionName = 'Ontology';
    OntologyPanel.ArangoURL = 'http://localhost:8529/_api/';

	function OntologyPanel() {
		/**Initializes Ontology Tab*/
        $('#mc_navbar_content').append($(htmlGraphSchemaTab));

        /*
		var query = {};
		query['query'] = 'FOR u in ' + OntologyPanel.CollectionName + ' RETURN u.name';
		$.post(OntologyPanel.ArangoURL + 'cursor', JSON.stringify(query), function (data) {
            require(['text!tpl/navbar/graphSchemaDbInterface.html'], function(htmlGraphSchemaDbInterface){
                var $ontoCtrl = $('#OntologyCtrl').find('.panel-body');
                $ontoCtrl.append($(htmlGraphSchemaDbInterface));

                inputWithDropDown($ontoCtrl, data.result);

                initLoadOntologyButton($ontoCtrl);
                initEditOntologyButton($ontoCtrl);
                initUploadOntologyButton($ontoCtrl);

                $ontoCtrl.append($.parseHTML('<h4> No Ontlogy loaded!</h4>'));
            });
        }).fail(function () {
            //Alert.Error('No Connection to Graph Schema Collection!', '#OntologyCtrl .panel-body');
        });

        var initLoadOntologyButton = function ($node) {
            $node.find('#btnLoadGraphSchema').click(function () {
                if (OntologyPanel.Ontology != null) {
                    Global.Ontology = OntologyPanel.Ontology;
                    InitGraphSchema.LoadJsonOntology(true);
                }
            });
        };
        var initEditOntologyButton = function ($node) {
            $node.find('#btnEditGraphSchema').click(function () {
                var jsoneditorContainer = $(document.createElement('div'))[0];
                var editor = new JSONEditor(jsoneditorContainer, {
                    mode : 'tree',
                    modes : ['code', 'form', 'text', 'tree', 'view']// allowed modes
                });
                editor.set(Global.Ontology);
                TabWrapper.AddCloseableTab('Ontology-' + Global.Ontology.name, jsoneditorContainer);
            });
        };
        var initUploadOntologyButton = function ($node) {
            $node.find('#btnUpdateGraphSchema').click(function () {
                Alert.Info('Upload Ontology not implemented!', '#OntologyCtrl .panel-body');
            });
        };


        //also defined in Project. Create Template for this function
        var inputWithDropDown = function ($node, elements) {
            var options = [];
            for (var i = 0; i < elements.length; i++) {
                options.push(addElementToInputWithDropDown(elements[i]));
            }
            $node.find('#OntologySelector_ul').append(options);
        };
        var addElementToInputWithDropDown = function (name) {
            return $($.parseHTML('<li><a href="#">' + name + '</a></li>'))
                .click(function () {
                    var selText = $(this).text();
                    $(this).parent().parent().find('#OntologySelector_input').val(selText);
                    var query = {};
                    query['query'] = 'FOR u in ' + OntologyPanel.CollectionName + ' FILTER u.name ==\"' + selText + '\" RETURN u';
                    $.post(OntologyPanel.ArangoURL + 'cursor', JSON.stringify(query), function (data) {
                        OntologyPanel.Ontology = data.result[0];

                    }).fail(function () {
                        Alert.Error('Something is wrong! Ontology seems not to exists ?', '#OntologyCtrl .panel-body');
                    });
                })
        };
        */
	}

	return OntologyPanel;
});
