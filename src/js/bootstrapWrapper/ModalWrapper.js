define(['jquery',
        'lodash',
        'text!tpl/modal.html'],
    /**@lends Modal*/ function ($, _, htmlModal) {

        /**
         * This class creates a Twitter Bootstrap Modal without any content.
         * the content can be an array of DOM-Objects or a single Object.
         * the modal will be appended to the body of the HTML-Document
         * @class
         * @param {Object|string} headerContent - the content of the header or the title for the header as string
         * @param {Object} bodyContent - the content of the body
         * @param {Object} footerContent - the content of the footer
         * @param  {string} id - the identifier of the modal
         * @param {string} size - the size of the modal can be small(modal-sm) or large(modal-lg)
         */
        function Modal(id, headerContent, bodyContent, footerContent, size) {
            var _headerContent;
            if(typeof headerContent === 'string') {
                _headerContent = [];
                _headerContent.push($($.parseHTML('<button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>')));
                _headerContent.push($(document.createElement('h4')).attr('class', 'modal-title').text(headerContent));
            }
            else {
                _headerContent = headerContent;
            }

            var _footerContent;
            if(!footerContent) {
                _footerContent = Modal.FooterContent();
            }
            else {
                _footerContent = footerContent;
            }

            var tpl =_.template(htmlModal);



            var $modal = $(tpl({id:id, size:size}));

            $modal.find('.modal-header').append(_headerContent);
            $modal.find('.modal-body').append(bodyContent);
            $modal.find('.modal-footer').append(_footerContent);

            $('body').append($modal);


            $('#' + id).modal({
                backdrop : true,
                show : true
            });
        }

        /**
         * a pattern function for a basic modal footer content
         * this pattern creates 3 buttons Close, Delete and Save
         * @param {Object} func - a object containing to properties with a delete and a save function
         * @returns {Array} the array with the contents of the footer
         */
        Modal.FooterContent = function (func) {
            var footerContent = [];
            if (func && func.deleteFunc) {
                footerContent.push($(document.createElement('button'))
                    .attr('type', 'button')
                    .attr('class', 'btn btn-danger')
                    .attr('data-dismiss', 'modal')
                    .text('Delete')
                    .click(func.deleteFunc));
            }
            footerContent.push($(document.createElement('button'))
                .attr('type', 'button')
                .attr('class', 'btn btn-default')
                .attr('data-dismiss', 'modal')
                .click(function () {
                    //remove modal from DOM
                    Modal.RemoveModal();
                })
                .text('Close'));
            if (func && func.saveFunc) {
                footerContent.push($(document.createElement('button'))
                    .attr('type', 'button')
                    .attr('class', 'btn btn-primary')
                    .attr('data-dismiss', 'modal')
                    .text('Save changes')
                    .click(function(){
                        func.saveFunc();
                        Modal.RemoveModal();
                    }));
            }
            return footerContent;
        };

        /**
         * removes the modal from the HTML-Page
         * @method
         */
        Modal.RemoveModal = function () {
            $('.modal').remove();
            $('.modal-backdrop').remove();
            $('body').css('overflow-y', 'scroll').css('padding-right', 5);
        };

        return Modal;
    });
