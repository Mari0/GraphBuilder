define(['jquery',
    'MappingManager',
    'ProjectManager',
    'text!tpl/navbar/importTab.html'], /**@lends ImportTab*/
	function ($, MappingManager, ProjectManager, htmlImportTab) {
	function ImportTab() {
        var $importTab = $(htmlImportTab);
        $('#mc_navbar_content').append($importTab);

        $importTab.find('#file_import').change(function () {
            var file = $(this).prop('files')[0];
            if (file) {
                if (file.name.search(/.json/) !== -1) {
                    var reader = new FileReader();
                    reader.readAsText(file, "UTF-8");

                    reader.onload = function (evt) {
                        var data =  JSON.parse(evt.target.result);
                        if(data.hasOwnProperty('projectName')) {
                            ProjectManager.fromJSON(data);
                            $('#mc_navbar').find('a[href=#ProjectCtrl]').click();
                        }
                        else {
                            MappingManager.createMappingCanvasFromJSON(file.name, data);
                        }
                    }
                } else {
                    $('#ImportCtrl').find('.panel-body').append($.parseHTML(
                        '<div class="alert alert-danger alert-dismissible" role="alert">' +
                        '<button type="button" class="close" data-dismiss="alert"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>' +
                        '<strong>Warning!</strong> Loading File failed. Only SVG for the MappingConfigurator can be loaded here.' +
                        '</div>'));
                }
            }
        });

	}
	return ImportTab;
});
