define(['jquery',
        'ProjectManager',
        'bootstrapWrapper/ModalWrapper',
        'text!tpl/form/formBase.html',
        'text!tpl/form/formInput.html'],
    /**@lends CreateProjectModal*/ function ($, ProjectManager, ModalWrapper, htmlFormBase, formInput) {

        function CreateProjectModal(){
            var $InputForm = $(_.template(formInput)({id:'txtProjectName',label:'Project Name',disabled:false}));

            var $form = $(htmlFormBase);
            $form.append($InputForm);
            var footerContent = ModalWrapper.FooterContent({saveFunc: function(){
                ProjectManager.setProjectName($('#txtProjectName').val());
            }});
            ModalWrapper('modalCreateProject', 'Create Project', $form, footerContent);

        }
        return CreateProjectModal;
    });