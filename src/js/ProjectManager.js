define(['jquery',
    'Global',
    'entities/MappingCanvas',
    'MappingManager',
    'bootstrapWrapper/TabWrapper'],
    /**@lends ProjectManager*/	function ($, Global, MappingCanvas, MappingManager, TabWrapper) {

        /**
         * The Class definition for the ProjectManager-Function
         * ProjectManager onyl contains static Members and Methods
         * @constructor
         */
        function ProjectManager() {

            var _projectName = null;

            var _mappings = {};

            var generateMappingEntry = function (name) {
                $('#lstMappings').append($(document.createElement('a'))
                    .attr('class', 'list-group-item')
                    .attr('href', '#')
                    .text(name)
                    .append($(document.createElement('span'))
                        .attr('class', 'glyphicon glyphicon-eye-open')
                        .click(function (event) {
                            var $target = $(event.target).parent();
                            var name = $target.text();
                            var mappingCanvas = _mappings[name];
                            if (Global.CurrentTabId !== mappingCanvas.getTabId()) {
                                if (MappingManager.doesMappingExists(mappingCanvas.getTabId())) {
                                    $('#mc_tab').find('a[href="' + mappingCanvas.getTabId() + '"]').click();
                                }
                                else {
                                    MappingManager.visualizeMappingCanvas(name, mappingCanvas);
                                }
                            }
                        }))
                    .append($(document.createElement('span'))
                        .attr('class', 'glyphicon glyphicon-remove')
                        .click(function (event) {
                            var $target = $(event.target).parent();
                            var name = $target.text();
                            $target.remove();
                            delete _mappings[name];

                        })));
            };

            return {
                setProjectName: function (name) {
                    _projectName = name;
                    $('.projectName').text('Project: ' + name);
                    $('#btnAddMapping').show();
                },
                getProjectName: function () {
                    return _projectName;
                },
                addCurrentMapping: function (name) {
                    if (!_mappings.hasOwnProperty(name)) {
                        _mappings[name] = MappingManager.getCurrentMappingCanvas();
                        TabWrapper.changeLabelOfCurrentTab(name);
                        generateMappingEntry(name);
                    }
                    else {
                        return new Error('A mapping with the id already exists');
                    }
                },
                toJSON: function () {
                    var json = { 'projectName': _projectName };
                    json.mappings = {};
                    for (var key in _mappings) {
                        if (_mappings.hasOwnProperty(key)) {
                            json.mappings[key] = _mappings[key].toJSON();

                        }
                    }
                    return json;
                },
                fromJSON: function (data) {
                    this.setProjectName(data.projectName);
                    for (var key in data.mappings) {
                        if (data.mappings.hasOwnProperty(key)) {
                            _mappings[key] = MappingCanvas.CreateMappingFromJSON(data.mappings[key]);
                            generateMappingEntry(key);

                        }
                    }
                },
                getMappingById: function (id) {
                    return _mappings.hasOwnProperty(id) ? _mappings[id] : null;
                },
                getMappings: function () {
                    return _mappings;
                }
            };
        }

        return new ProjectManager();
    });
