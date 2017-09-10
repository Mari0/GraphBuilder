define(['jquery',
        'lodash',
        'panels/FooterContent',
        'text!tpl/form/formBase.html',
        'text!tpl/form/formInput.html',
        'text!tpl/form/formCheckBox.html'],
    /**@lends NodeClassPanel*/ function ($, _, FooterContent, htmlFormBase, htmlFormInput, htmlFormCheckBox) {

        function NodeClassPanel(nodeClass){

            var $InputForm = $(_.template(htmlFormInput)({id: 'txtPropName', label:'Name',disabled:false}));
            var $CheckboxForm = $(_.template(htmlFormCheckBox)({id: 'chkbxId', label: 'Is Reference ?'}));

            var $form = $(htmlFormBase);
            $InputForm.find('input').val(nodeClass.getName());
            if(nodeClass.isReference()) {
                $CheckboxForm.find('input').attr('checked', '');
            }

            $form.append($InputForm);
            $form.append($CheckboxForm);

            var footerContent = new FooterContent();
            footerContent.registerOkButtonCallback(function(event){
                var _$panel = $('#' + nodeClass.getId() + '_panel');
                var newName = _$panel.find('#txtPropName').val();
                var isChecked =  _$panel.find('#chkbxId').is(':checked');
                if(nodeClass.getName() !== newName) {
                    nodeClass.editName(newName);
                }
                if(isChecked) {
                    nodeClass.enableReference();
                }
                else if(!isChecked) {
                    nodeClass.disableReference();
                }
                event.data.close();
            });

            var $panel = $.jsPanel({
                id : nodeClass.getId() + '_panel',
                size:     { width: 412, height: 53 },
                selector: 'body',
                title:    'NodeClass: ' + nodeClass.getName(),
                position: 'top center',
                theme:'light',
                toolbarFooter: footerContent.getContent()
            });
            $panel.find('div[class*=ui-resizable-handle]').remove();
            $panel.content.append($form);
        }
        return NodeClassPanel;
    });