define(['jquery',
        'MappingManager',
        'util/InitGraphSchema',
        'text!tpl/navbar/fileInputTab.html'
    ],
    function($, MappingManager, InitGraphSchema, htmlFileInputTab) {
        /** loads the datasource example and initializes drag&drop-event and svg-element*/
        function loadDataSourceExample() {
            var fileInput = document.getElementById('upload');
            if (fileInput) {
                var file = fileInput.files[0];
                if (file.name.search(/.json/) !== -1) {
                    var reader = new FileReader();
                    reader.readAsText(file, 'UTF-8');

                    reader.onload = function(evt) {
                        MappingManager.createMappingCanvasFromExample(file.name, JSON.parse(evt.target.result));
                    };

                } else {
                    alert('Not a json file');
                }
            }
        }

        /**Initializes the File Input Tab*/
        function FileInputTab() {
            var $fileInputTabContent = $(htmlFileInputTab);
            $('#mc_navbar_content').append($fileInputTabContent);
            $fileInputTabContent.find('#reader').click(function() {
                loadDataSourceExample();
            });
            $fileInputTabContent.find('#vizOntology').click(function() {
                InitGraphSchema.LoadOntology();
            });

            $fileInputTabContent.find('#extendDomain').click(function() {

                var fileInput = document.getElementById('upload');
                if (fileInput) {
                    for (var f = 0; f < fileInput.files.length; f++) {
                        var file = fileInput.files[f];
                        if (file.name.search(/.json/) !== -1) {
                            var reader = new FileReader();
                            reader.readAsText(file, 'UTF-8');

                            reader.onload = function(evt) {
                                var currentDomain = MappingManager.getCurrentMappingCanvas().getDomain();
                                var ext = MappingManager.generateDomain(JSON.parse(evt.target.result));

                                var extensionHelper = function(domain) {
                                    var entities = domain.getElements();
                                    for (var p in entities) {
                                        if (entities.hasOwnProperty(p)) {
                                            var entity = entities[p];

                                            if (!currentDomain.hasOwnProperty(p)) {
                                                var root = entity.JsonPath.GetRoot();
                                                var base = currentDomain[root.Path];
                                                currentDomain[entity.JsonPath.Path] = entity;
                                                base.add(entity);
                                                entity.get$node().css({
                                                    'stroke': 'green',
                                                    'stroke-width': 5

                                                });
                                            }

                                            if (entity.constructor.name === 'JsonObject' || entity.constructor.name === 'JsonArray') {
                                                extensionHelper(entity);
                                            }
                                        }
                                    }
                                };
                                extensionHelper(ext.data);

                                MappingManager.getCurrentMappingCanvas().repaintDomain();
                                var mappingRules = MappingManager.getCurrentMappingCanvas().getMappingRules();
                                for (var k in mappingRules) {
                                    if (mappingRules.hasOwnProperty(k)) {
                                        mappingRules[k].repaint();
                                    }
                                }

                            };

                        } else {
                            alert('Not a json file');
                        }
                    }


                }
            });

        }


        return FileInputTab;
    });