define(['jquery',
    'text!tpl/icons/keyIcon.txt'], function ($, txtKeyIcon) {

    function SvgKeyIcon() {
        return $(document.createElementNS('http://www.w3.org/2000/svg', 'symbol'))
            .attr('id', 'keyIcon')
            .append($(document.createElementNS('http://www.w3.org/2000/svg', 'path'))
                .attr('d', txtKeyIcon));
    }
    return SvgKeyIcon;
});