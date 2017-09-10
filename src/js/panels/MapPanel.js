define(['util/MappingForm',
        'panels/FooterContent'],
    /**@lends MapPanel*/ function (MappingForm, FooterContent) {

        /**
         * The Panel containing the Mapping form
         * @param node
         * @constructor
         */
        function MapPanel(node){
            var mappingForm = MappingForm();

            var $panel = $.jsPanel({
                size:     { width: 712, height: 553 },
                selector: 'body',
                title:    'Mapping for ' +  node.label,
                position: "top left",
                theme:'light',
                toolbarFooter: new FooterContent().getContent()
            });
            $panel.find('div[class*=ui-resizable-handle]').remove();
            $panel.content.append(mappingForm.form);

        }
        return MapPanel;
    });