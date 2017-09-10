define(['jquery',
    'jsonEditor',
    'panels/FooterContent'], /**@lends EdgePanel*/ function ($, JsonEditor, FooterContent) {

    function EdgePanel(edge){
        var footerContent = new FooterContent();

        var $panel = $.jsPanel({
            size:     { width: 452, height: 153 },
            selector: 'body',
            title:    edge.id,
            position: "top right",
            theme:'light',
            toolbarFooter: footerContent.getContent()
        });
        var $jsonEditorContainer = $(document.createElement('div'));

        var editor = new JsonEditor($jsonEditorContainer[0], {
            mode : 'view'
        });
        editor.set(edge);

        $panel.find('div[class*=ui-resizable-handle]').remove();
        $panel.content.append($jsonEditorContainer);
    }
    return EdgePanel;
});