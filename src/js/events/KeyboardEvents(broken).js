define(['jquery', 'MappingConfigurator', 'ModalHelper', 'SVGTranslationRule'], /**@lends KeyboardEvents*/
    function($, SVGMappingConfigurator, fmcModalHelper, MappingRule) {
        /**
         * @class
         * provide some shortcuts for the svg-panel. not finished yet, maybe still some bugs
         * @example
         * STR + M - Mark element
         * ALT + UP - Move the marked element up
         * ALT + DOWN - Move the marked element down
         * ALT + R - create a Mapping rule
         * @todo
         * at more shortcuts for creating edges, hiding and showing elements and other stuff
         */
        function KeyboardEvents(keys) {

            var arrKey = Object.keys(keys);


            if (arrKey[0] == 17 && arrKey[1] === 77) { //Mark element STR+M
                console.log("Ctrl + M pressed");
                if (!SVGMappingConfigurator.focusedObject) {
                    return;
                }
                SVGMappingConfigurator.focusedObject.css({
                    'stroke': 'blue',
                    'stroke-width': 5
                });
                try {
                    SVGMappingConfigurator.markedObjects[SVGMappingConfigurator.focusedObject.attr('id')] = SVGMappingConfigurator.focusedObject[0];
                } catch (e) {}

            } else if (arrKey[0] === 18 && arrKey[1] === 38) { //Move up ALT+UP
                console.log("ALT + Up pressed");
                for (var key in SVGMappingConfigurator.markedObjects) {
                    if (SVGMappingConfigurator.markedObjects.hasOwnProperty(key)) {
                        var silbling = $(SVGMappingConfigurator.markedObjects[key]).prev();
                        while (SVGMappingConfigurator.markedObjects.hasOwnProperty(silbling.attr('id'))) {
                            silbling = silbling.prev();
                        }
                        if (silbling.prop('tagName') === 'text' || silbling.prop('tagName') === 'rect' || silbling.attr('class') === 'ontoLabel') {
                            continue;
                        }
                        $(SVGMappingConfigurator.markedObjects[key]).insertBefore(silbling);
                        SVGMappingConfigurator.reDrawVertexClass($(SVGMappingConfigurator.markedObjects[key]).parent()[0]);
                    }
                }
                fmcModalHelper.reDrawDSTree();
            } else if (arrKey[0] === 18 && arrKey[1] === 40) { //Move down: ALT + DOWN
                console.log("ALT + Down pressed");
                for (var key2 in SVGMappingConfigurator.markedObjects) {
                    if (SVGMappingConfigurator.markedObjects.hasOwnProperty(key2)) {
                        var silbling2 = $(SVGMappingConfigurator.markedObjects[key2]).next();
                        while (SVGMappingConfigurator.markedObjects.hasOwnProperty(silbling2.attr('id'))) {
                            silbling2 = silbling2.next();
                        }
                        if (silbling2.prop('tagName') === 'text' || silbling2.prop('tagName') === 'rect' || silbling2.attr('class') === 'ontoLabel') {
                            continue;
                        }
                        $(SVGMappingConfigurator.markedObjects[key2]).insertAfter(silbling2);
                        SVGMappingConfigurator.reDrawVertexClass($(SVGMappingConfigurator.markedObjects[key2]).parent()[0]);
                    }
                }
                fmcModalHelper.reDrawDSTree();
            } else if (arrKey[0] === 18 && arrKey[1] === 82) { //ALT + R
                MappingRule.addTranslationRule();
            }


        }
        return KeyboardEvents;
    });