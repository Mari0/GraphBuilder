define(['bootstrapWrapper/ModalWrapper',
        'NetworkManager',
        'ProjectManager',
        'util/MappingForm'],
    /**@lends MappingModal*/ function (ModalWrapper, NetworkManager, ProjectManager, MappingForm) {

        /**
         * The modal containing the mapping form
         * @constructor
         */
        function MappingModal(){
            var mappingForm = MappingForm();
            var footerContent = ModalWrapper.FooterContent({saveFunc: function(){
                var selectedMapping = $('#selectMapping').find(':selected').attr('value');
                var canvas = ProjectManager.getMappingById(selectedMapping);
                NetworkManager.map(canvas, mappingForm.jsonEditor.get());
                if(!$('#visNetwork').is('li')) {
                    NetworkManager.initNetwork();
                }
            }});
            ModalWrapper('modalMapping', 'Data input for Mapping',mappingForm.form, footerContent, 'modal-lg');
        }
        return MappingModal;
    });