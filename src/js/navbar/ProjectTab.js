define(['jquery',
        'modals/CreateProjectModal',
        'modals/AddMappingModal',
        'modals/MappingModal',
        'text!tpl/navbar/projectTab.html'],
    /**@lends ProjectTab*/function ($, CreateProjectModal, AddMappingModal, MappingModal, htmlProjectTab) {

    function ProjectTab(){
        var $projectTab = $(htmlProjectTab);
        var $contentPanel = $projectTab.find('.panel-body');

        $projectTab.find('#btnCreateProject').click(function(){
            CreateProjectModal();
        });

        $projectTab.find('#btnStartMapping').click(function () {
            MappingModal();
        });

        $contentPanel.append($('<h4 class="projectName">').text('No Project!'));

        var $mappingList = $('<div class="list-group" id="lstMappings"></div>');
        $contentPanel.append($mappingList);

        //Add Mapping button
        var $addMappingButton = $('<button class="btn btn-default" id="btnAddMapping" style="display: none"><span class="glyphicon glyphicon-plus"></span></button>');
        $addMappingButton.click(function(){
            AddMappingModal();
        });
        $contentPanel.append($addMappingButton);

        $('#mc_navbar_content').append($projectTab);

    }

    return ProjectTab;
});