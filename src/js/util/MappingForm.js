define(['jquery',
        'lodash',
        'ProjectManager',
        'jsonEditor',
        'text!tpl/navbar/projectMappingSelector.html',
        'text!tpl/navbar/radioButton.html',
        'text!tpl/navbar/htmlGETForm.html',
        'text!tpl/navbar/htmlPOSTForm.html'],
    /**@lends MappingForm*/ function ($,_, ProjectManager, JsonEditor, htmlProjectMappingSelector, htmlRadioButton, htmlGetForm, htmlPOSTForm) {


        function MappingForm(){
            var $projectMappingSelector = $(_.template(htmlProjectMappingSelector)(null));
            var $fileInput = $(_.template(htmlRadioButton)({name: 'Device', active: ''}));
            var $httpGet =   $(_.template(htmlRadioButton)({name: 'HTTP GET', active: ''}));
            var $httpPost =   $(_.template(htmlRadioButton)({name: 'HTTP POST', active: ''}));

            //initialize project mappings
            var $mappingSelContainer = $(document.createElement('div')).attr('class', 'form-inline');
            var projectName = ProjectManager.getProjectName();
            if(projectName) {
                $projectMappingSelector.find('.projectName').text('Project: ' + projectName);
                $projectMappingSelector.find('select').show();
                var mappings = ProjectManager.getMappings();
                for (var key in mappings) {
                    if (mappings.hasOwnProperty(key)) {
                        $projectMappingSelector.find('select').append($(document.createElement('option'))
                            .attr('value', key)
                            .text(key));
                    }
                }
                $mappingSelContainer.append($projectMappingSelector);
            }

            //initialize data input type selection container
            var $dataLoaderContainer = $(document.createElement('div')).attr('class', 'form-inline');

            var $jsonEditorContainer = $(document.createElement('div')).attr('class', 'form-inline').css('height',550);
            var editor = new JsonEditor($jsonEditorContainer[0], {
                mode : 'view'
            });

            var $dataInputTypeContainer = $(document.createElement('div')).attr('class', 'form-inline')
                .append($(document.createElement('div')).attr('class', 'btn-group').attr('data-toggle', 'buttons')
                    .append($fileInput.click(function(event) {
                        event.stopPropagation();
                        var $txtFormGroup = $('<div class ="form-group"></div>');
                        var $input = $(document.createElement('input')).attr('type', 'file').attr('class', 'form-control');
                        $txtFormGroup.append($input);
                        $input.change(function(){
                            var file = $(this).prop('files')[0];
                            if (file) {
                                if (file.name.search(/.json/) !== -1) {
                                    var reader = new FileReader();
                                    reader.readAsText(file, "UTF-8");

                                    reader.onload = function (evt) {
                                        editor.set(JSON.parse(evt.target.result));
                                    }
                                }
                            }
                        });
                        $dataLoaderContainer.empty();
                        $dataLoaderContainer.append($txtFormGroup);
                    }))
                    .append($httpGet.click(function(event){
                        event.stopPropagation();

                        var $httpGetForm = $(htmlGetForm);
                        $dataLoaderContainer.empty();
                        $dataLoaderContainer.append(htmlGetForm);
                        $httpGetForm.find('button').click(function(){
                            var url = $(this).siblings('input').val();
                            $.get(url, function(data){
                                editor.set(data);
                            });
                        })
                    }))
                    .append($httpPost).click(function(event){
                        event.stopPropagation();
                        var $httpPostForm = $(htmlPOSTForm);
                        $dataLoaderContainer.empty();
                        $dataLoaderContainer.append($httpPostForm);
                    }));

            return {
                jsonEditor: editor,
                form: [$mappingSelContainer,$dataInputTypeContainer,$dataLoaderContainer,$jsonEditorContainer]
            };
        }
        return MappingForm;
});