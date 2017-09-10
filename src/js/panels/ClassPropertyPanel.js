define(['jquery',
        'Global',
        'panels/FooterContent',
        'text!tpl/form/formBase.html',
        'text!tpl/form/formInput.html',
        'text!tpl/form/formCheckBox.html'],
    /**@lends ClassPropertyPanel*/ function ($, Global, FooterContent, htmlFormBase, htmlFormInput, htmlFormCheckbox) {

        function ClassPropertyPanel(classProperty) {
            var $InputForm = $(_.template(htmlFormInput)({id: 'txtPropName', label: 'Name', disabled: false}));
            var $CheckboxForm = $(_.template(htmlFormCheckbox)({id: 'chkbxId', label: 'Is identifier ?'}));

            var $form = $(htmlFormBase);
            $InputForm.find('input').val(classProperty.Name);
            if (classProperty.isIdentifier()) {
                $CheckboxForm.find('input').attr('checked', '');
            }

            $form.append($InputForm);
            $form.append($CheckboxForm);

            var footerContent = new FooterContent();
            footerContent.registerOkButtonCallback(function (event) {
                var _$panel = $(Global.GetSelectorFromId(classProperty.getId() + '_panel'));
                var newName = _$panel.find('#txtPropName').val();
                var isChecked = _$panel.find('#chkbxId').is(':checked');
                if (classProperty.Name !== newName) {
                    if (classProperty.editName(newName, isChecked)) {
                        event.data.close();
                    }
                    else {
                        $.jsPanel({
                            paneltype: 'hint',
                            theme: 'danger',
                            position: 'top right',
                            autoclose: -1, // deactivates autoclose
                            size: {width: 400, height: 'auto'},
                            content: '<div style="font-size:26px;"><div style="float:left;width:auto;height:100%"><span class="glyphicon glyphicon-warning-sign" style="font-size:30px;padding:20px;"></span></div><p style="padding:26px 0;">Property name already exists.</p></div>'
                        });
                        //.css('box-shadow', '0 0 50px 20px rgba(64, 64, 64, 1)');
                    }
                } else if (isChecked) {
                    classProperty.enableIdentifier();
                    event.data.close();
                }
                else if (!isChecked) {
                    classProperty.disableIdentifier();
                    event.data.close();
                }
            });

            var $panel = $.jsPanel({
                id: classProperty.getId() + '_panel',
                size: {width: 412, height: 53},
                selector: 'body',
                title: "ClassProperty: " + classProperty.Name,
                position: "top center",
                theme: 'light',
                toolbarFooter: footerContent.getContent()
            });
            $panel.find('div[class*=ui-resizable-handle]').remove();
            $panel.content.append($form);
        }

        return ClassPropertyPanel;
    });