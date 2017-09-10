define(['jquery',
        'text!tpl/icons/gearIcon.txt'], function ($, txtGearIcon) {

    function SvgGearIcon() {
        return $(document.createElementNS('http://www.w3.org/2000/svg', 'symbol'))
            .attr('id', 'gearIcon')
            .append($(document.createElementNS('http://www.w3.org/2000/svg', 'path'))
                .attr('d', txtGearIcon));
    }
    return SvgGearIcon;
});