/*global requirejs */
requirejs.config({
    baseUrl: 'js',
    shim: {
        bootstrap: {
            deps: ['jquery']
        },
        'jquery-contextmenu': {
            deps: ['jquery']
        },
        'jqueryui': {
            exports: '$',
            deps: ['jquery']
        },
        jsPanel: {
            deps: ['jqueryui']
        }
    },
    paths: {
        bootstrap: './../components/bootstrap/dist/js/bootstrap.min',
        jquery: './../components/jquery/dist/jquery.min',
        jqueryui: './../components/jquery-ui/jquery-ui.min',
        'jquery-contextmenu': './../components/jQuery-contextMenu/dist/jquery.contextMenu',
        'jquerui-position': './../components/jQuery-contextMenu/src/jquery.ui.position',
        lodash: './../components/lodash/lodash.min',
        JsonPath: './../components/JSONPath/lib/jsonpath',
        text: './../components/requirejs-text/text',
        tpl: './../templates',
        jsPanel: './../components/jspanel/source/jquery.jspanel.min',
        jsPlumb: './../components/jsPlumb/dist/js/jsPlumb-2.0.7-min'
    },
    map: {
        '*': {
            css: './../components/require-css/css.min'
        }
    }
});
requirejs(['css!../style', 'Main', 'bootstrap', 'jsPanel']);