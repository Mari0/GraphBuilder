define(['jquery',
        'ProjectManager',
        'bootstrapWrapper/ModalWrapper',
        'text!tpl/form/formBase.html',
        'text!tpl/form/formInput.html'
        ],
    /**@lends CreateProjectModal*/ function ($, ProjectManager, ModalWrapper, htmlFormBase, formInput) {

        function CreateProjectModal(){
            var $InputForm = $(_.template(formInput)({id:'txtMappingName',label:'Mapping Name',disabled:false}));

            var $form = $(htmlFormBase);
            $form.append($InputForm);
            var footerContent = ModalWrapper.FooterContent({saveFunc: function(){
                ProjectManager.addCurrentMapping($('#txtMappingName').val()) ;
            }});

            ModalWrapper('modalCreateProject', 'Add Mapping', $form, footerContent);


        }
        return CreateProjectModal;
    });