define(['jquery',
        'MappingManager',
        'ProjectManager',
        'text!tpl/navbar/exportTab.html'],
    function ($, MappingManager, ProjectManager, htmlExportTab) {
	function MappingConfigExportTab() {
        //MC export panel
        var $exportTab = $(htmlExportTab);
        $('#mc_navbar_content').append($exportTab);



        $exportTab.find('#export').click(function () {
            var MIME_TYPE = 'application/json';
            var data;
            var $rdBtn = $('#rdBtnExport').find('.active');

            if($rdBtn.is('#exportMapping')) {
                data = MappingManager.getCurrentMappingCanvas().toJSON();
            }
            else if($rdBtn.is('#exportProject')) {
                data = ProjectManager.toJSON();
            }

            var blob = new Blob([JSON.stringify(data, null, 4)], {
                type: MIME_TYPE
            });
            $(this).attr('href', window.URL.createObjectURL(blob));
            $(this).attr('download', $('#fileName_export').val());
            //$(this).attr('data-downloadurl', [MIME_TYPE, $(this).attr('download'), $(this).attr('href')].join(':'));
        });
	}
	return MappingConfigExportTab;
});
