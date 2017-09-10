define(['jquery',
    'jsonEditor',
    'panels/FooterContent',
    'panels/MapPanel'], /**@lends NodePanel*/ function ($, JsonEditor, FooterContent, MapPanel) {

    function NodePanel(node){
        var footerContent = new FooterContent();
        var footer = footerContent.getContent();

        //if node is a reference node
        if(node.hasOwnProperty('shape') && node.shape === 'square'){
            var htmlMapBtn = '<button type="button" class="btn btn-primary" style="float: left;"><span class="glyphicon glyphicon-file"></span></button>';
            var mapBtn = {
                item: htmlMapBtn,
                event: 'click',
                btnclass: 'btn-sm',
                btntext: ' Map',
                callback: function () {
                    new MapPanel(node);
                }
            };
            footer.unshift(mapBtn);
        }


        if(node.hasOwnProperty('cluster')) {
            var htmlClusterBtn = '<button type="button" class="btn btn-warning" style="float: left;"><span class="glyphicon glyphicon-minus"></span></button>';
            var clusterBtn = {
                item: htmlClusterBtn,
                event: 'click',
                btnclass: 'btn-sm',
                btntext: ' Close Cluster',
                callback: function (event) {
                    var NetworkManager = require('NetworkManager');
                    var network = NetworkManager.getNetwork();
                    network.clusterById(node.cluster);
                    event.data.close();
                }
            };
            footer.unshift(clusterBtn);
        }


        var $panel = $.jsPanel({
            size:     { width: 512, height: 203 },
            selector: 'body',
            title:    node.label,
            position: "top center",
            theme:'light',
            toolbarFooter: footer
        });

        var $jsonEditorContainer = $(document.createElement('div'));

        var editor = new JsonEditor($jsonEditorContainer[0], {
            mode : 'view'
        });
        editor.set(node);

        $panel.find('div[class*=ui-resizable-handle]').remove();
        $panel.content.append($jsonEditorContainer);
    }
    return NodePanel;
});